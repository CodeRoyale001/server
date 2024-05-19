const {ErrorHandler} = require("../utils");

//Errors:
module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal Server Error";

	// Wrong Mongodb Id error
	if (err.name === "CastError") {
		const message = `Resource not found. Invalid: ${err.path}`;
		err = new ErrorHandler(message, 400);
	}

	// Mongoose duplicate key error
	if (err.code === 11000) {
		const message = `${Object.keys(err.keyValue)} already exists`;
		err = new ErrorHandler(message, 400);
	}

	// Wrong JWT error
	if (err.name === "JsonWebTokenError") {
		const message = `Json web token is invalid, Try again`;
		err = new ErrorHandler(message, 400);
	}

	//  JWT Expire error
	if (err.name === "TokenExpiredError") {
		const message = `Json web token is expired, Try again`;
		err = new ErrorHandler(message, 400);
	}

	// console.error(err.statusCode);
	// console.error(err.message);

	res.status(err.statusCode).json({
		success: false,
		message: err.message,
	});
};
