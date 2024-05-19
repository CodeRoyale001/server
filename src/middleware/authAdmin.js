const jwt = require("jsonwebtoken");
const { User } = require("../models");
const config = require("../config/config");


const authAdmin = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, config.ACCESS_TOKEN_PRIVATE_KEY);
        const user = await User.findOne({ _id: decoded._id });
        if (user && decoded.userRole==="Admin") {
          req.user = user;
          next();
        } else {
          res.status(401);
          throw new Error("Not authorized");
        }
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized");
      }
    } else {
      res.status(401);
      throw new Error("No token found!");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authAdmin;