const { model } = require("mongoose");

class UserDTO {
    constructor({
        userName,
        firstName,
        lastName,
        userEmail,
        userPhone,
        userCountry,
        userPassword,
        userRole,
        githubLink,
        linkedInLink,
        twitterLink,
        userInstitute,
        userAvatar,
    }) {
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
        this.userCountry = userCountry;
        this.userPassword = userPassword;
        this.userRole = userRole;
        this.githubLink = githubLink;
        this.linkedInLink = linkedInLink;
        this.twitterLink = twitterLink;
        this.userInstitute = userInstitute;
        this.userAvatar = userAvatar;
    }
}

class UserUpdateDTO {
    constructor({
        id,
        firstName,
        lastName,
        userPhone,
        userCountry,
        githubLink,
        linkedInLink,
        twitterLink,
        userInstitute,
        userAvatar,
    }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userPhone = userPhone;
        this.userCountry = userCountry;
        this.githubLink = githubLink;
        this.linkedInLink = linkedInLink;
        this.twitterLink = twitterLink;
        this.userInstitute = userInstitute;
        this.userAvatar = userAvatar;
    }
}

module.exports = { UserDTO, UserUpdateDTO }
