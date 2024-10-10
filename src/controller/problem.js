const { Problem } = require("../models");
const { problemDTO,testCaseDTO } = require('../DTO');
const { default: mongoose } = require("mongoose");
const e = require("express");
const { createBulkTestCases } = require("./testCase");

const Solved = mongoose.connection.collection("solved")


const createProblem = async (problemData) => {
    // Create a new problem using the provided problem data
    const newProblem = new problemDTO.ProblemDTO(problemData.questionDetail);
    newProblem.code = problemData.code; // Correctly assign the code to the new problem
    newProblem.createdBy = problemData.createdBy;
    // console.log(newProblem);

    try {
        // Save the new problem to the database
        const result = await Problem.create(newProblem);


        // Bulk insert the test cases, mapping `testcase.input` to `testCase.testcase`
        const TestCases = problemData.testCases.map(testCase => {
            const newTestCase = new testCaseDTO.TestCaseDTO({
                testCase: testCase.input, // Map input to testCase
                output: testCase.output,
                createdBy: newProblem.createdBy,
                problemId: result._id,
                approved: true
            });
            return newTestCase; // Return the new test case object
        });

        // const testCases = await createBulkTestCases(TestCases);
        // console.log(TestCases);

        return { result, TestCases };
    } catch (error) {
        console.log(error);
        throw error;
    }
};



const approveProblem = async ({ problemId }) => {
	const result = await Problem.findOneAndUpdate(
		{ _id: problemId },
		{
			approved: true,
		},
		{
			new: true,
			runValidators: true,
			useFindAndModify: false,
		}
	);
	if (result) return result;
	else throw new Error("Incorrect Problem Id");
};

const getRandomProblem = async ({ difficulty }) => {
	try {
		// Construct the query object based on whether difficulty is provided
		const query = difficulty
			? { $and: [{ difficulty: difficulty }, { approved: true }] }
			: { approved: true };

		// Get the total count of documents that match the query
		const count = await Problem.countDocuments(query);
		//   console.log(count);

		// Generate a random number based on the document count
		const random = Math.floor(Math.random() * count);
		//   console.log(random);

		// Fetch the problem at the random offset
		const result = await Problem.findOne(query).skip(random);

		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
};


const getProblem = async ({ title, userId }) => {
	try {
		if (title) {
			// Find the problem with the given title and check if it's approved
			const result1 = await Problem.findOne({ $and: [{ title: title }, { approved: true }] });

			if (!result1) {
				throw new Error("Problem not found");
			}

			// Now, perform a lookup to get the status from the 'solved' collection
			const solvedInfo = await Solved.findOne({
				$and: [
					{ questionid: result1._id.toString() }, // Ensure questionid matches the problem ID
					{ userid: userId } // Match with the current user
				]
			});
			// Add the status field to the result
			if (solvedInfo) {
				if (solvedInfo.status == 0){
					result1.status = "Solved";
				}else if (solvedInfo.status == 1){
					result1.status = "Attempted";
				}
			}else{
				result1.status = "Unsolved";
			}
			return [result1];
		} else {
			// Aggregate problems and match with solved records if no title is provided
			const allProblems = await Problem.aggregate([
				{
					$lookup: {
						from: "solved",
						let: { problemId: "$_id" },
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{ $eq: ["$questionid", { $toString: "$$problemId" }] },
											{ $eq: ["$userid", userId] }
										]
									}
								}
							}
						],
						as: "solvedInfo"
					}
				},
				{
					$unwind: {
						path: "$solvedInfo",
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$match: {
						approved: true
					}
				},
				{
					$project: {
						_id: 1,
						title: 1,
						tags: 1,
						approved: 1,
						status: {
							$cond: {
								if: { $eq: ["$solvedInfo.status", 0] },
								then: "Solved",
								else: {
									$cond: {
										if: { $eq: ["$solvedInfo.status", 0] },
										then: "Solved",
										else: {
											$cond: {
												if: { $eq: ["$solvedInfo.status", 1] },
												then: "Attempted",
												else: "Unsolved"
											}
										}
									}
								}
							}
						}
					}
				}
			]);
			return allProblems;
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

module.exports = { getProblem };



const deleteProblem = async ({ id }) => {
	const result = await Problem.findById({ _id: id })
	await result.remove();
}

const updateProblem = async (updateProblemData) => {
	const newProblem = new problemDTO.ProblemUpdateDTO(updateProblemData);
	const result = Problem.findOneAndUpdate(
		{ _id: newProblem.id },
		newProblem,
		{
			new: true,
			runValidators: true,
			useFindAndModify: false,
		}
	);

	return result;
}

module.exports = { createProblem, approveProblem, getRandomProblem, getProblem, deleteProblem, updateProblem };

