const authUser=require("./authUser");
const catchAsyncError=require("./catchAsyncErrors");
const errorMiddleware=require("./error");
const authAdmin=require("./authAdmin");
const authProblemSetter=require("./authProblemSetter");
const auth = require("./auth")

module.exports={
    authUser,
    catchAsyncError,
    errorMiddleware,
    authAdmin,
    authProblemSetter,
    auth
}