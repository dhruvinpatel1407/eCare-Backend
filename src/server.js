const express = require("express");
const chalk = require("chalk");
const cors = require("cors");


const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const physicianRoutes = require("./routes/physicianRoutes")
const appointmentRoutes = require("./routes/appointmentRoutes");
const serviceRoutes = require("./routes/servicesRoutes");
const demographicRoutes = require("./routes/demographicRoutes");
const pdfRoutes = require("./routes/reportRoutes");
const dbConnection = require("./config/config");

dbConnection();
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    exposedHeaders: ["x-auth-token"],
  })
);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//Protected routes
app.use("/api/users", userRoutes);
app.use("/api/physicians",physicianRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/demographics", demographicRoutes);
app.use("/api/pdf", pdfRoutes);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(chalk.yellow.bold(`Server is running on port ${PORT}`));
});

// Error handling
server.on("error", (error) => {
  console.error(chalk.red.bold("Server error:"), error);
  if (error.code === "EADDRINUSE") {
    console.log(
      chalk.red("Port is already in use. Trying a different port...")
    );
    const newPort = 5001;
    server.close(() => {
      server.listen(newPort, () => {
        console.log(chalk.yellow(`Server restarted on port ${newPort}`));
      });
    });
  }
});
