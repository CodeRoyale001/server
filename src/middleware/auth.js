const jwt = require("jsonwebtoken");
const { User } = require("../models");
const config = require("../config/config");

const auth = async (req) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      // console.log(token);
      
      const decoded = jwt.verify(token, config.ACCESS_TOKEN_PRIVATE_KEY);
      const user = await User.findOne({ _id: decoded._id });
      
      if (user) {
        return user; // Return the user object
      } else {
        throw new Error("Not authorized"); // Throw an error instead of using res.status()
      }
    } else {
      throw new Error("No token found!"); // Throw error for missing token
    }
  } catch (error) {
    throw new Error(error.message || "Authorization failed!"); // General error handling
  }
};

module.exports = auth;
