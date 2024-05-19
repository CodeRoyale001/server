const express = require("express")
const {problemController} = require("../controller");
const {ErrorHandler} = require("../utils");
const {authProblemSetter,authAdmin,authUser}=require("../middleware")
const router = express.Router();

router.post("/createProblem" ,authProblemSetter, async(req,res,next)=>{

    try {
        const result = await problemController.createProblem({id:req.user._id,...req.body});
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

// router.put("/updateProblem/:id" , async(req,res,next)=>{

//     try {
//         const result = await problemController.updateProblem({id:req.params['id'], ...req.body});
//         res.json(result);

//     } catch (error) {
//         next(new ErrorHandler(error))
//     }
// })

// router.delete("/deleteProblem/:id" , async(req,res,next)=>{

//     try {
//         const result = await problemController.deleteProblem({id:req.params['id']});
//         res.json(result);

//     } catch (error) {
//         next(new ErrorHandler(error))
//     }
// })

router.get("/getProblem",authUser, async(req,res,next)=>{

    try {
        const result = await problemController.getProblem(req.query);
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})
router.put("/approveProblem/:id",authAdmin,async(req,res,next)=>{
    try{
        const result=await problemController.approveProblem({problemId:req.params['id']});
        res.json(result);
    }catch (error) {
        next(new ErrorHandler(error))
    }
})

module.exports = router; 
