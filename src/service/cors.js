const cors = require("cors");
const config=require("../config/config");
const allowedOrigins = [
  "http://localhost:5005",
  "http://localhost:3000",
  config.FRONTEND_URI,
  // "https://oj-front-end.vercel.app",
];



const corsConnect = () =>
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1)
        return callback(
          new Error(
            "The CORS policy for this site does not allow access from the specified Origin."
          ),
          false
        );
      return callback(null, true);
    },
    credentials: true,
  });

module.exports = {
  corsConnect,
};
