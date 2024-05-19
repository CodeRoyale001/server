const express = require("express");
const config = require("./src/config/config");
const bodyParser = require("body-parser");
const {dbConnect,corsConnect} = require("./src/service");
const {errorMiddleware} = require("./src/middleware");
const {userRouter, tokenRouter, problemRouter, editorialRouter, testCaseRouter, problemSetterRouter}=require("./src/routes")
// const {handleUncaughtException,handleUncaughtRejection}=require("./src/utils")
const connectApp = async () => {
	const app = express();
	//middleware
	app.use(express.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	//adding CORS
	app.use(corsConnect.corsConnect());
	//Routes
	app.use("/user", userRouter);
	app.use("/api",tokenRouter,problemRouter,editorialRouter,testCaseRouter,problemSetterRouter);

	app.use(errorMiddleware);

	// app.use("/problem-api" , problemRouter);
	//database connection
	try {
		await dbConnect.dbConnect();
	} catch (error) {
		console.log(error);
	}
	//server connection
	app.listen(config.PORT, () => {
		console.log(`Server running on port ${config.PORT}`);
	});
	//? Handling Uncaught Exceptions
	// process.on("uncaughtException", (err) => {
	// 	handleUncaughtException(err)
	// });
	// //? Unhandled Promise Rejection
	// process.on("unhandledRejection", (err) => {
	// 	handleUncaughtRejection(err)
	// });
};

connectApp();