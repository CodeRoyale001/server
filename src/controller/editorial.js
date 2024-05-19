const config = require("../config/config");
const { Editorial } = require("../models");

const createEditorial = async ({
	content,
    userId,
    Id,
	approved,
}) => {

	const result = await Editorial.create({
        content,
        createdBy: userId,
        problemId: Id,
        approved,
	});
	return result;
};

const approveEditorial = async ({ editorialId }) => {
	const result = await Editorial.findOneAndUpdate(
		{ _id: editorialId },
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
	else throw new Error("Incorrect Editorial Id");
};

const getEditorial = async ({ id }) => {
	try { 
		const result = await Editorial.findOne({ problemId: id });
		if (!result) {
			throw new Error("Editorial not found");
		}
		return result;

	} catch (error) {
		console.log(error);
	}
};

const deleteEditorial = async({ id }) => {
    const result = await Editorial.findOne({ problemId: id });
    await result.remove();
}

const updateEditorial = async({
    id,
    content,
    userId,
    problemId,
	approved,
}) => {
    const result = Editorial.findOneAndUpdate(
        {_id:id},
        {
            content,
            userId,
            problemId,
	        approved,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    return result;
}

module.exports = { createEditorial, approveEditorial, getEditorial, deleteEditorial, updateEditorial};

