class ProblemSetterDTO {
    constructor({
        occupation,
        codingLang,
        experience,
        reason,
        appliedBy,
        approved,
    }) {
        this.occupation = occupation;
        this.codingLang = codingLang;
        this.experience = experience;
        this.reason = reason;
        this.appliedBy = appliedBy;
        this.approved = approved;
    }
}

class ProblemSetterUpdateDTO {
    constructor({
        id,
        occupation,
        codingLang,
        experience,
        reason,
        approved,
    }) {
        this.id = id;
        this.occupation = occupation;
        this.codingLang = codingLang;
        this.experience = experience;
        this.reason = reason;
        this.approved = approved;
    }
}
module.exports = { ProblemSetterDTO, ProblemSetterUpdateDTO };
