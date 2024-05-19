module.exports.handleUnhandledRejection = (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    process.exit(1);
  };