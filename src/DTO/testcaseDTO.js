class TestCaseDTO {
    constructor({
        testCase,
        output,
        createdBy,
        problemId,
        approved,
    }) {
        this.testCase = testCase;
        this.output = output;
        this.createdBy = createdBy;
        this.problemId = problemId;
        this.approved = approved;
    }
}

class TestCaseUpdateDTO {
    constructor({
        id,
        testCase,
        output,
        approved,
    }) {
        this.id = id;
        this.testCase = testCase;
        this.output = output;
        this.approved = approved;
    }
}

module.exports = { TestCaseDTO, TestCaseUpdateDTO }
