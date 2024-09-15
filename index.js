const express = require("express");
const config = require("./src/config/config");
const bodyParser = require("body-parser");
const { dbConnect, corsConnect } = require("./src/service");
const { errorMiddleware,auth } = require("./src/middleware");
const { userRouter, tokenRouter, problemRouter, editorialRouter, testCaseRouter, problemSetterRouter } = require("./src/routes");
const { expressMiddleware } = require("@apollo/server/express4");
const startGqlServer = require("./src/graphql");
const fileUpload = require("express-fileupload");
const connectApp = async () => {
  const app = express();

  // Middleware for JSON parsing
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  
  // Initialize GraphQL server and apply the express middleware with context
  const gqlServer = await startGqlServer();
  app.use(
	  "/graphql",
	  expressMiddleware(gqlServer, {
		  context: async ({ req }) => {
			try {
			  console.log(req.headers.authorization); // Log headers for debugging
			  const user = await auth(req); // Auth will throw error if unauthorized
			  return { user }; // Pass the user object to the context
			} catch (error) {
			  // console.error(error); // Log error for debugging
			  throw new Error("Authentication failed");
			}
		  }})
	);
	// Apply CORS middleware
	app.use(corsConnect.corsConnect());
  app.use(fileUpload({
    useTempFiles: true,
    // tempFileDir: './'
  }));
  // Regular REST API routes
  app.use("/user", userRouter);
  app.use("/ping", (req, res) => {
    res.send("Pong");
  });
  app.use("/api", tokenRouter, problemRouter, editorialRouter, testCaseRouter, problemSetterRouter);

  // Error handling middleware
  app.use(errorMiddleware);

  // Database connection
  try {
    await dbConnect.dbConnect();
    console.log("Connected to the database successfully");
  } catch (error) {
    console.log("Database connection failed", error);
  }

  // Start the server
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });

  // Optional: Handle Uncaught Exceptions
//   process.on("uncaughtException", (err) => {
//     console.error("Uncaught Exception:", err);
//   });

//   // Optional: Handle Unhandled Promise Rejections
//   process.on("unhandledRejection", (err) => {
//     console.error("Unhandled Rejection:", err);
//   });
};

connectApp();
