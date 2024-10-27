const userRouter=require("./userRoutes");
const tokenRouter=require("./tokenRoutes");
const problemRouter=require("./problemRoutes");
const testCaseRouter=require("./testCaseRoutes");
const editorialRouter=require("./editorialRoutes");
const problemSetterRouter = require("./problemSetterRoutes");
const openAiRouter = require("./openAiRoutes");
module.exports={
    userRouter,
    tokenRouter,
    problemRouter,
    testCaseRouter,
    editorialRouter,
    problemSetterRouter,
    openAiRouter
}