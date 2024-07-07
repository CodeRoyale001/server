class EditorialDTO {
    constructor({
        content,
        createdBy,
        problemId,
        approved,
    }) {
        this.content = content;
        this.createdBy = createdBy;
        this.problemId = problemId;
        this.approved = approved;
    }
}

class EditorialUpdateDTO {
    constructor({
        id,
        content,
        approved,
    }) {
        this.id = id;
        this.content = content;
        this.approved = approved;
    }
}

module.exports = {  EditorialDTO, EditorialUpdateDTO}