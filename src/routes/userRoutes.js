const express = require("express")
const {userController} = require("../controller");
const {ErrorHandler} = require("../utils");
const { authUser, authAdmin } = require("../middleware");
const router = express.Router();

router.post("/signup" , async(req,res,next)=>{

    try {

        const result = await userController.createUser(req.body);
        res.json(result);

    } catch (error) {
        next(error);
    }
})

router.post("/login",async(req,res,next)=>{
    try{
        
        const result = await userController.loginUser(req.body);
        res.json(result);

    }catch(error){
        next(new ErrorHandler(error));
    }
})

router.put("/updateUser",authUser, async(req,res,next)=>{

    try {
        const result = await userController.updateUser({id:req.user._id, ...req.body});
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.delete("/deleteUser/",authUser, async(req,res,next)=>{

    try {
        const result = await userController.deleteUser({id:req.user._id});
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.get("/getUser" ,authAdmin, async(req,res,next)=>{

    try {
        const result = await userController.getUserData(req.query);
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.get("/getUserRole" , async(req,res,next)=>{

    try {
        const result = await userController.getUserRole(req.query);
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})



module.exports = router; 
