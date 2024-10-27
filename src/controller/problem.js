const { Problem } = require("../models");
const { problemDTO, testCaseDTO } = require('../DTO');
const { default: mongoose } = require("mongoose");
const { Logger } = require('../utils');
const { createBulkTestCases } = require("./testCase");

const Solved = mongoose.connection.collection("solved");

const createProblem = async (problemData) => {
    Logger.info("Creating a new problem");
    const newProblem = new problemDTO.ProblemDTO(problemData.questionDetail);
    newProblem.code = problemData.code;
    newProblem.createdBy = problemData.createdBy;

    try {
        const result = await Problem.create(newProblem);
        Logger.info(`Problem created with ID: ${result._id}`);

        const TestCases = problemData.testCases.map(testCase => {
            const newTestCase = new testCaseDTO.TestCaseDTO({
                testCase: testCase.input,
                output: testCase.output,
                createdBy: newProblem.createdBy,
                problemId: result._id,
                approved: true
            });
            return newTestCase;
        });

        Logger.info(`Test cases created for problem ID: ${result._id}`);
        return { result, TestCases };
    } catch (error) {
        Logger.error("Error creating problem:", error);
        throw error;
    }
};

const approveProblem = async ({ problemId }) => {
    Logger.info(`Approving problem with ID: ${problemId}`);
    const result = await Problem.findOneAndUpdate(
        { _id: problemId },
        { approved: true },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );
    if (result) {
        Logger.info(`Problem approved with ID: ${problemId}`);
        return result;
    } else {
        Logger.error(`Problem not found with ID: ${problemId}`);
        throw new Error("Incorrect Problem Id");
    }
};

const getRandomProblem = async ({ difficulty }) => {
    Logger.info(`Fetching a random problem with difficulty: ${difficulty}`);
    try {
        const query = difficulty
            ? { $and: [{ difficulty: difficulty }, { approved: true }] }
            : { approved: true };

        const count = await Problem.countDocuments(query);
        const random = Math.floor(Math.random() * count);
        const result = await Problem.findOne(query).skip(random);

        Logger.info(`Random problem fetched with ID: ${result._id}`);
        return result;
    } catch (error) {
        Logger.error("Error fetching random problem:", error);
        throw error;
    }
};

const getProblem = async ({ title, userId }) => {
    Logger.info(`Fetching problem with title: ${title} for user: ${userId}`);
    try {
        if (title) {
            const result1 = await Problem.findOne({ $and: [{ title: title }, { approved: true }] });

            if (!result1) {
                Logger.error("Problem not found with title:", title);
                throw new Error("Problem not found");
            }

            const solvedInfo = await Solved.findOne({
                $and: [
                    { questionid: result1._id.toString() },
                    { userid: userId }
                ]
            });

            if (solvedInfo) {
                if (solvedInfo.status == 0) {
                    result1.status = "Solved";
                } else if (solvedInfo.status == 1) {
                    result1.status = "Attempted";
                }
            } else {
                result1.status = "Unsolved";
            }

            Logger.info(`Problem fetched with ID: ${result1._id}`);
            return [result1];
        } else {
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
                                        if: { $eq: ["$solvedInfo.status", 1] },
                                        then: "Attempted",
                                        else: "Unsolved"
                                    }
                                }
                            }
                        }
                    }
                }
            ]);

            Logger.info(`Fetched ${allProblems.length} problems`);
            return allProblems;
        }
    } catch (error) {
        Logger.error("Error fetching problem:", error);
        throw error;
    }
};

const deleteProblem = async ({ id }) => {
    Logger.info(`Deleting problem with ID: ${id}`);
    const result = await Problem.findById({ _id: id });
    await result.remove();
    Logger.info(`Problem deleted with ID: ${id}`);
};

const updateProblem = async (updateProblemData) => {
    Logger.info(`Updating problem .....`);
    const newProblem = new problemDTO.ProblemUpdateDTO(updateProblemData);
    const result = await Problem.findOneAndUpdate(
        { _id: newProblem.id },
        newProblem,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    Logger.info(`Problem updated Successfully.`);
    return result;
};

module.exports = { createProblem, approveProblem, getRandomProblem, getProblem, deleteProblem, updateProblem };