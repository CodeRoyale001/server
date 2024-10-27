require("dotenv").config();

module.exports = Object.freeze({
  PORT: process.env.PORT || 8007, // just added it so that even if env congfig is not present i will run smoothly on other pc.
  DB: process.env.DB_URI,
  ACCESS_TOKEN_PRIVATE_KEY: process.env.ATPK,
  REFRESH_TOKEN_PRIVATE_KEY: process.env.RTPK,
  JWT_SECRET: process.env.JWT_SECRET,
  SALT: process.env.SALT,
  REFRESH_TOKEN_EXPIRE_IN:process.env.REFRESH_TOKEN_EXPIRE_IN,
  ACCESS_TOKEN_EXPIRE_IN:process.env.ACCESS_TOKEN_EXPIRE_IN,
  FRONTEND_URI: process.env.FRONTEND_URI,
  CLOUDINARY_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});
