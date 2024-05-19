const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testCaseSchema = new Schema(
    {
        testCase:{
            type:String,
            required:true,
        },
        output:{
            type:String,
            required:true,
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
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


