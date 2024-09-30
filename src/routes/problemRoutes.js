const express = require("express")
const {problemController, solvedController} = require("../controller");
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

router.get("/getProblem", authUser, async (req, res, next) => {
    try {
        const { title } = req.query; // Extract title directly from query params
        const result = await problemController.getProblem({
            title: title || null, // Pass title as null if not provided
            userId: req.user.userName // Ensure userId is passed correctly
        });

        if (result.length === 0) {
            // Return 404 if no problem is found
            return res.status(404).json({
                success: false,
                message: "No problems found"
            });
        }

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(new ErrorHandler(error.message || "Something went wrong", error.status || 500));
    }
});

router.put("/approveProblem/:id",authAdmin,async(req,res,next)=>{
    try{
        const result=await problemController.approveProblem({problemId:req.params['id']});
        res.json(result);
    }catch (error) {
        next(new ErrorHandler(error))
    }
})

router.get("/getRandomProblem", async(req,res,next)=>{
    try{
        const result=await problemController.getRandomProblem(req.query);
        res.json(result);
    }catch (error) {
        next(new ErrorHandler(error))
    }
})

module.exports = router; 
