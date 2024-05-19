const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const editorialSchema = new Schema(
    {
        content:{
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
            default:false,
        }
    }
);
const Editorial = mongoose.models.Editorial || mongoose.model('Editorial', editorialSchema);
module.exports = Editorial;


