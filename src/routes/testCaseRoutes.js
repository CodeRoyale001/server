const express = require("express")
const {testCaseController} = require("../controller");
const {ErrorHandler} = require("../utils");
const router = express.Router();

router.post("/createTestCase" , async(req,res,next)=>{

    try {
        const result = await testCaseController.createTestCase(req.body);
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.put("/updateTestCase/:id" , async(req,res,next)=>{

    try {
        const result = await testCaseController.updateTestCase({id:req.params['id'], ...req.body});
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.delete("/deleteTestCase/:id" , async(req,res,next)=>{

    try {
        const result = await testCaseController.deleteTestCase({id:req.params['id']});
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.get("/getTestCase/:quesId" , async(req,res,next)=>{

    try {
        const result = await testCaseController.getTestCase({id:req.params['quesId']});
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})
router.post("/approveTestCase",async(req,res,next)=>{
    try{
        const result=await testCaseController.approveTestCase(req.body);
        res.json(result);
    }catch (error) {
        next(new ErrorHandler(error))
    }
})

module.exports = router; 
