const { ProblemSetter } = require("../models");
const { updateUser } = require("./user");

const createProblemSetter = async ({
	occupation,
	codingLang,
	experience,
	reason,
	userId,
}) => {
	try {
		const result = await ProblemSetter.create({
			occupation,
			codingLang,
			experience,
			reason,
			appliedBy: userId,
		});
		if(result) 
		{
			const res = updateUser({id:userId, userRole:"AppliedProblemSetter" });
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
