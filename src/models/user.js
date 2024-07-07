const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName:{
            type: String,
            required: true,
            unique: true,
        },
        firstName:{
            type: String,
            required: false,
            
        },
        lastName:{
            type: String,
            required: false,
            
        },
        userEmail:{
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        userPhone:{
            type: Number,
            required: false,
        },
        userCountry:{
            type: String,
            required: false,
        },
        userPassword:{
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            unique: false
        },
        userRole:{
            type: Number,
            required: false,
            default: 0,
        },
        githubLink:{
            type: String,
            required: false,
        },
        linkedInLink:{
            type: String,
            required: false,
        },
        twitterLink:{
            type: String,
            required: false,
        },
        userInstitute:{
            type: String,
            required: false,
        },
        userAvatar:{
            type: String,
            required: false,
        },
    },
    {
        timestamp: true,
    }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;


