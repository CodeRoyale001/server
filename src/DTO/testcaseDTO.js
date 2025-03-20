class TestCaseDTO {
    constructor({
        input,
        output,
        createdBy,
        problemId,
        approved,
    }) {
        this.input = input;
        this.output = output;
        this.createdBy = createdBy;
        this.problemId = problemId;
        this.approved = approved;
    }
}

class TestCaseUpdateDTO {
    constructor({
        id,
        input,
        output,
        approved,
    }) {
        this.id = id;
        this.input = input;
        this.output = output;
        this.approved = approved;
    }
}

module.exports = { TestCaseDTO, TestCaseUpdateDTO }
