const jwt = require("jsonwebtoken");
const { User } = require("../models");
const config = require("../config/config");


const authProblemSetter = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, config.ACCESS_TOKEN_PRIVATE_KEY);
        // console.log(decoded);
        const user = await User.findOne({ _id: decoded._id });
        if (user && (user.userRole==="problemSetter" || user.userRole==="Admin")) {
          req.user = user;
          next();
        } else {
          res.status(401);
          throw new Error("Not authorized");
        }
      } catch (error) {
        res.status(401);
        // console.log(error);
        throw new Error(error);
      }
    } else {
      res.status(401);
      throw new Error("No token found!");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authProblemSetter;