const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testCaseSchema = new Schema(
    {
        input:{
            type:String,
            required:true,
        },
        output:{
            type:String,
            required:true,
        },
        createdBy:{
            type: String,
            required: true
        },
        problemId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        approved:{
            type:Boolean,
            default:true,
        }
    }
);
const TestCase = mongoose.models.TestCase || mongoose.model('TestCase', testCaseSchema);
module.exports = TestCase;


