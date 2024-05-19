const ErrorHandler=require("./errorHandler");
const handleUncaughtException =require("./handleUncaughtException");
const handleUnhandledRejection =require("./handleUnhandledRejection");

module.exports={
    ErrorHandler,
    handleUncaughtException,
    handleUnhandledRejection
}