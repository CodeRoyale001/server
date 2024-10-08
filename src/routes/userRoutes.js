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

router.delete("/deleteUser",authUser, async(req,res,next)=>{

    try {
        const result = await userController.deleteUser({id:req.user._id});
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.get("/getAllUsers", authAdmin, async(req,res,next)=>{

    try {
        const accessToken = req.headers.authorization.split(" ")[1];
        const result = await userController.getAllUserData(accessToken);
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.get("/getUser", authUser, async(req,res,next)=>{

    try {
        const accessToken = req.headers.authorization.split(" ")[1];
        const result = await userController.getUserData(accessToken);
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})
router.get("/getUser/:userName", async(req,res,next)=>{

    try {
        const result = await userController.getUserByUserName(req.params.userName);
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.get("/getUserRole",  async(req,res,next)=>{

    try {
        const result = await userController.getUserRole(req.query);
        res.json(result);

    } catch (error) {
        next(new ErrorHandler(error))
    }
})

router.put("/uploadavatar",authUser, async (req, res, next) => {
    try {
      // Check if file is uploaded      
      if (!req.files || !req.files.image) {
        return res.status(400).json({ success: false, message: "No image uploaded" });
      }
  
      const result = await userController.uploadAvatar({image:req.files.image,userId:req.user._id});
      res.json({ success: true, url: result.url });
    } catch (error) {
      next(new ErrorHandler(error.message));
    }
  });
  


module.exports = router; 
