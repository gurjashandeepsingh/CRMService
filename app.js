import express from "express";
import mongoose from "mongoose";
import { logger } from "./winstonLogger.js";
import bodyParser from "body-parser";
import { EmployeeRoutes } from "./routes/employeeRoutes/employeeRoutes.js";
import { LeadAndCustomerRoutes } from "./routes/customerRoutes/customerRoutes.js";

const app = express();
export const port = 9000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/employeeRoutes", EmployeeRoutes);
app.use("/leadAndCustomer", LeadAndCustomerRoutes);

function databaseConnection() {
  mongoose
    .connect("mongodb://127.0.0.1:27017/CRMSoftware", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoCreate: true,
    })
    .then(() => logger.info("Database connected to CRM-Software"))
    .catch((error) => {
      logger.error("Can not connect to Database", error);
    });
}

function serverStartup() {
  app.listen(port, () => {
    logger.info("Server started");
  });
}

function appStartup() {
  databaseConnection();
  serverStartup();
}

appStartup();
