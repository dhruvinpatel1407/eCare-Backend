const mongoose = require("mongoose");
const chalk = require("chalk");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const database = mongoose.connection;

    database.on("error", (err) => {
      console.error(chalk.red.bold("Database connection error:"), err);
    });

    database.once("connected", () => {
      console.log(chalk.yellow.bold("Database Connected"));
    });
  } catch (error) {
    console.error(chalk.red.bold("Failed to connect to MongoDB:"), error);
    process.exit(1); // Exit the process with error code
  }
};

module.exports = dbConnection;
