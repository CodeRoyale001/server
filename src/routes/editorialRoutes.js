const express = require("express")
const {editorialController} = require("../controller");
const {ErrorHandler} = require("../utils");
const router = express.Router();

router.post("/createEditorial" , async(req,res,next)=>{

    try {

        const result = await editorialController.createEditorial(req.body);
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.put("/updateEditorial/:id" , async(req,res,next)=>{

    try {
        const result = await editorialController.updateEditorial({id:req.params['id'], ...req.body});
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.delete("/deleteEditorial/:id" , async(req,res,next)=>{

    try {
        const result = await editorialController.deleteEditorial({id:req.params['id']});
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.get("/getEditorial", async(req,res,next)=>{
    try {
        const result = await editorialController.getEditorial(req.body);
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})
router.post("/approveEditorial",async(req,res,next)=>{
    try{
        const result=await editorialController.approveEditorial(req.body);
        res.json(result);
    }catch (error) {
        next(new ErrorHandler(error))
    }
})
module.exports = router; 
