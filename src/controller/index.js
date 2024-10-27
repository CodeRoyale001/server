const userController=require("./user")
const userTokenController=require("./userToken")
const problemController = require("./problem")
const editorialController = require("./editorial")
const testCaseController =require("./testCase")
const problemSetterController = require("./problemSetter")
const openAiController = require("./openAi")

module.exports={
    userController,
    userTokenController,
    problemController,
    editorialController,
    testCaseController,
    problemSetterController,
    openAiController
}