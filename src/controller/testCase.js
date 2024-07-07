const { TestCase } = require("../models");
const { testCaseDTO } = require("../DTO");

const createTestCase = async (testCaseData) => {
	try {
		const newTestCase=new testCaseDTO.TestCaseDTO(testCaseData);
		const result = await TestCase.create(newTestCase);
		return result;
	} catch (error) {
		throw error
	}

};

const approveTestCase = async ({ editorialId }) => {
	try {
		const result = await TestCase.findOneAndUpdate(
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
		return result;
	} catch (error) {
		throw error
	}
};

const getTestCase = async ({ id }) => {
	try { 
		const result = await TestCase.find({ problemId: id });
		if (!result) {
			throw new Error("TestCase not found");
		}
		return result;

	} catch (error) {
		throw error;
	}
};

const deleteTestCase = async({ id }) => {
    const result = await TestCase.findOne({ problemId: id });
    await result.remove();
}

const updateTestCase = async(updateTestCaseData) => {
	const newTestCase=new testCaseDTO.TestCaseUpdateDTO(updateTestCaseData);
    const result = TestCase.findOneAndUpdate(
        {_id:newTestCase.id},
        newTestCase,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    return result;
}

module.exports = { createTestCase, approveTestCase, getTestCase, deleteTestCase, updateTestCase};

