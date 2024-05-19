
const { Problem } = require("../models");

const createProblem = async ({
	title,
	content,
	tags,
	difficulty,
	approved,
	id,
}) => {
	try {
		const result = await Problem.create({
			title,
			content,
			createdBy: id,
			tags,
			difficulty,
			approved,
		});
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

const updateProblem = async({
    id,
    title,
	content,
	tags,
	difficulty,
	approved,
	userEmail,
}) => {
    const result = Problem.findOneAndUpdate(
        {_id:id},
        {
            title,
	        content,
	        tags,
	        difficulty,
	        approved,
	        userEmail,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    return result;
}

module.exports = { createProblem, approveProblem, getProblem, deleteProblem, updateProblem};

