const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const problemSetterSchema = new Schema(
    {
        occupation:{
            type:String,
            required:true,
        },
        codingLang:{
            type:String,
            required:true,
        },
        experience:{
            type:Number,
            required:true,
        },
        reason:{
            type:String,
            required:true,
        },
        appliedBy:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
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

const ProblemSetter = mongoose.models.ProblemSetter || mongoose.model('ProblemSetter', problemSetterSchema);
module.exports = ProblemSetter;


