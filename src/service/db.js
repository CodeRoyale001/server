const mongoose=require("mongoose")
const config = require("../config/config");
const dbConnect=async ()=>{
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(config.DB);
        console.log("Database Connected");
      } catch (error) {
        console.log("Database Connection Failed");
        console.log(error);
      }
}
module.exports={
    dbConnect
}