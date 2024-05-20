const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URI,
  "https://serene-fortress-91389-77d1fb95872a.herokuapp.com"
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
