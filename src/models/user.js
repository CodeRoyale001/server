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
            required: true,
            
        },
        lastName:{
            type: String,
            required: true,
            
        },
        userEmail:{
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        userPhone:{
            type: Number,
            required: true,
            unique: true,
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
        userInstitute:{
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


