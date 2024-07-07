const { ProblemSetter } = require("../models");
const { updateUser } = require("./user");
const {problemSetterDTO} = require('../DTO');

const createProblemSetter = async (ProblemSetterData) => {
	const newProblemSetter = new problemSetterDTO.ProblemSetterDTO(ProblemSetterData);
	try {
		const result = await ProblemSetter.create(newProblemSetter);
		if(result) 
		{
			const res = updateUser({id:newProblemSetter.appliedBy, userRole:"AppliedProblemSetter" });
		}
		else throw new Error("Unable to update");

		return result;
	} catch (error) {
		throw error;
	}
};

const getProblemSetter = async () => {
	try {
		const allProblemSetter = await ProblemSetter.find({ approved: false });
		return allProblemSetter;
	} catch (error) {
		console.log(error);
		throw error;
	}
};


const approveProblemSetter = async ({ userId }) => {
	try {
    const result = await ProblemSetter.findOneAndUpdate(
      { appliedBy: userId},
      {
        approved: true,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    // console.log(result);
    if (result) 
    {
      const res = updateUser({id:userId, userRole:"ProblemSetter" });
      if(res) return res;
      else throw new Error("Unable to update")
    }
    else throw new Error("Error");

	} catch (error) {
		throw error;
	}
};



module.exports = { createProblemSetter, approveProblemSetter, getProblemSetter };
