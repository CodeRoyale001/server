const { Problem } = require("../models");
const {problemDTO} = require('../DTO');

const createProblem = async (problemData) => {
	const newProblem = new problemDTO.ProblemDTO(problemData);
	try {
		const result = await Problem.create(newProblem);
		return result;
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
  
  


const getProblem = async ({title}) => {
	try {
		if (title) {
			const result1 = await Problem.findOne({$and: [{title: title},{ approved: true }]});

			if (!result1) {
				throw new Error("Problem not found");
			}
			return result1;
		} else{
			// throw new Error("Invalid Page");
			const allProblems = await Problem.find({approved:true});
			return allProblems;
		}

	} catch (error) {
		console.log(error);
		throw error;
	}
};

const deleteProblem = async({ id }) => {
    const result = await Problem.findById({ _id: id })
    await result.remove();
}

const updateProblem = async(updateProblemData) => {
	const newProblem=new problemDTO.ProblemUpdateDTO(updateProblemData);
    const result = Problem.findOneAndUpdate(
        {_id:newProblem.id},
        newProblem,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    return result;
}

module.exports = { createProblem, approveProblem,getRandomProblem, getProblem, deleteProblem, updateProblem};

