const { Editorial } = require("../models");
const {editorialDTO} = require('../DTO');

const createEditorial = async (editorialData) => {
	const newEditorial = new editorialDTO.EditorialDTO(editorialData);
	const result = await Editorial.create(newEditorial);
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
		throw error;
		// console.log(error);
	}
};

const deleteEditorial = async({ id }) => {
    const result = await Editorial.findOne({ problemId: id });
    await result.remove();
}

const updateEditorial = async(editorialUpdateData) => {
	const newEditorial=new editorialDTO.EditorialUpdateDTO(editorialUpdateData);
    const result = Editorial.findOneAndUpdate(
        {_id:newEditorial.id},
        newEditorial,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    return result;
}

module.exports = { createEditorial, approveEditorial, getEditorial, deleteEditorial, updateEditorial};

