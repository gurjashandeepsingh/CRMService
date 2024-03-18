import express from "express";
import { validationResult, body, query } from "express-validator";
import { logger } from "../../winstonLogger.js";
import { EmployeeService } from "../../services/employeeServices/employeeServices.js";
import { AuthenticationMiddleware } from "../../middleware/jwtMiddleware.js";

const router = express.Router();

const registerEmployeeValidation = [
  body("email").notEmpty().withMessage("Email cannot be empty"),
  body("password").notEmpty().withMessage("Password can not be empty"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password cannot be empty"),
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("levelId").notEmpty().withMessage("Level cannot be empty"),
  body("parentId").notEmpty().withMessage("Parent cannot be empty"),
];
router.post(
  "/registerEmployee",
  registerEmployeeValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      console.log(validationError);
      throw new Error("Provide all the parameters");
    }
    try {
      const { email, password, confirmPassword, name, levelId, parentId } =
        request.body;
      console.log(request.body);
      const registerEmployeeInstance = await new EmployeeService();
      const result = await registerEmployeeInstance.registerEmployee(
        email,
        password,
        confirmPassword,
        name,
        levelId,
        parentId
      );
      response.status(200).send(result);
      logger.info(result);
    } catch (error) {
      response.status(400).send(error);
      //   logger.error(error);
      console.log(error);
    }
  }
);

const loginEmployeeValidation = [
  body("email").notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
router.post(
  "/loginEmployee",
  loginEmployeeValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      console.log(validationError);
      throw new Error("Provide all the parameters");
    }
    try {
      const { email, password } = request.body;
      const loginEmployeeInstance = await new EmployeeService();
      const result = await loginEmployeeInstance.loginEmployee(email, password);
      response.status(200).send(result);
      logger.info(result);
    } catch (error) {
      response.status(400).send(error);
      logger.info(error);
    }
  }
);

const employeeInformationUpdate = [
  body("fieldName").notEmpty().withMessage("Field name is required."),
  body("fieldValue").notEmpty().withMessage("Field value is required."),
  body("id").notEmpty().withMessage("Id is required."),
];
router.post(
  "/updateEmployeeInfo",
  new AuthenticationMiddleware().isAuthenticate,
  employeeInformationUpdate,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      console.log(validationError);
      throw new Error("Provide all the parameters");
    }
    try {
      const { fieldName, fieldValue, id } = request.body;
      const updateEmployeeInfoInstance = new EmployeeService();
      const result = await updateEmployeeInfoInstance.updateEmployeeInfo(
        fieldName,
        fieldValue,
        id
      );
      response.status(200).send(result);
      logger.info(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const deleteEmployeeValidation = [
  body("employeeId").notEmpty().withMessage("ID must be provided"),
  body("adminId").notEmpty().withMessage("Admin ID must be provided"),
];
router.post(
  "/deleteEmployee",
  new AuthenticationMiddleware().isAuthenticate,
  deleteEmployeeValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      console.log(validationError);
      throw new Error("Provide all the parameters");
    }
    try {
      const { employeeId, adminId } = request.body;
      const deleteEmployeeInstance = await new EmployeeService();
      const result = await deleteEmployeeInstance.deleteEmployee(
        employeeId,
        adminId
      );
      response.status(200).send(result);
      logger.info(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const showAllEmployeesValidation = [body("organizationNumber").optional()];
router.get(
  "/showAllEmployees",
  //   new AuthenticationMiddleware().isAuthenticate,
  showAllEmployeesValidation,
  async (request, response) => {
    try {
      const { organizationNumber } = request.body;
      const showEmployeeInstance = await new EmployeeService();
      const result = await showEmployeeInstance.showEmployee(
        organizationNumber
      );
      response.status(200).send(result);
      logger.info(`Showing employees: ${JSON.stringify(result)}`);
    } catch (error) {
      response.status(400).send(error);
      logger.error(error);
    }
  }
);

const findEmployeeValidation = [
  query("userId").notEmpty().withMessage("User id is required"),
];
router.get(
  "/findEmployee",
  new AuthenticationMiddleware().isAuthenticate,
  findEmployeeValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide userId");
    }
    try {
      const { userId } = request.query;
      const findEmployeeInstance = await new EmployeeService();
      const result = await findEmployeeInstance.findEmployee(userId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const getLevelValidation = [body("employeeId").optional()];
router.get("/getLevel", getLevelValidation, async (request, response) => {
  try {
    const { employeeId } = request.query;
    const getlevelInstance = await new EmployeeService();
    const result = await getlevelInstance.getLevel(employeeId);
    response.status(200).send(result);
  } catch (error) {
    response.status(400).send(error);
  }
});

const updatelevelValidation = [
  body("fieldName").notEmpty().withMessage("Field name is required."),
  body("fieldValue").notEmpty().withMessage("Field Value is required"),
  query("employeeId").notEmpty().withMessage("EmployeeId is required"),
];
router.put(
  "/updateLevel/:id",
  updatelevelValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({ errors: validationError.array() });
    }
    try {
      const { fieldName, fieldValue } = request.body;
      const { employeeId } = request.query;
      const updatelevelInstance = await new EmployeeService();
      const result = await updatelevelInstance.updatelevel(
        fieldName,
        fieldValue,
        employeeId
      );
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

export { router as EmployeeRoutes };
