const { TestCase } = require("../models");

const createTestCase = async ({
	testCase,
	output,
    userId,
    problemId,
	approved,
}) => {
	console.log(testCase);
	try {
		const result = await TestCase.create({
			testCase,
			output,
			createdBy: userId,
			problemId,
			approved,
		});
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
		console.log(error);
	}
};

const deleteTestCase = async({ id }) => {
    const result = await TestCase.findOne({ problemId: id });
    await result.remove();
}

const updateTestCase = async({
    id,
    content,
    userId,
    problemId,
	approved,
}) => {
    const result = TestCase.findOneAndUpdate(
        {_id:id},
        {
            content,
			output,
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

module.exports = { createTestCase, approveTestCase, getTestCase, deleteTestCase, updateTestCase};

