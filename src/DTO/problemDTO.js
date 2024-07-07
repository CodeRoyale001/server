class ProblemDTO {
    constructor({
        title,
        content,
        createdBy,
        tags,
        difficulty,
        approved,
    }) {
        this.title = title;
        this.content = content;
        this.createdBy = createdBy;
        this.tags = tags;
        this.difficulty = difficulty;
        this.approved = approved;
    }
}

class ProblemUpdateDTO {
    constructor({
        id,
        title,
        content,
        tags,
        difficulty,
        approved,
    }) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.tags = tags;
        this.difficulty = difficulty;
        this.approved = approved;
    }
}

module.exports = { ProblemDTO, ProblemUpdateDTO }