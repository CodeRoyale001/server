const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const problemSchema = new Schema(
    {
        title:{
            type:String,
            required:true,
            unique:true,
        },
        content:
        {
            type:String,//it will store Rich text
            required:true,
        },
        createdBy:{
            type: String,
            required: true
        },
        tags:{
            type:[String]//tag id
        },
        difficulty:{
            type:String,
            required:true,
        },
        code:{
            type:String
        },
        approved:{
            type:Boolean,
            default:false,
        }
    },
    {
        timestamp: true,
    }
     
);
const Problem = mongoose.models.Problem || mongoose.model('Problem', problemSchema);
module.exports = Problem;


