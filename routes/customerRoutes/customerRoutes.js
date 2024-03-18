import { validationResult, body, query } from "express-validator";
import express, { request, response } from "express";
const router = express.Router();
import { Lead } from "../../models/leadModel.js";
import { Customer } from "../../models/customerModel.js";
import { CustomerAndLeadService } from "../../services/customerServices/customerAndLeadService.js";
import { AuthenticationMiddleware } from "../../middleware/jwtMiddleware.js";
import { logger } from "../../winstonLogger.js";

const registerLeadValidation = [
  body("employeeId").notEmpty().withMessage("Username is required."),
  body("firm_name").notEmpty().withMessage("firm_name is required."),
  body("poc").notEmpty().withMessage("Poc is required."),
  body("contact").notEmpty().withMessage("Contact number is required."),
  body("success").notEmpty().withMessage("True or False value requires"),
];
router.post(
  "/registerLead",
  registerLeadValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide all parameters");
    }
    try {
      const { employeeId, firm_name, poc, contact, success } = request.body;
      const registerLeadValidation = await new CustomerAndLeadService();
      const result = await registerLeadValidation.registerLead(
        employeeId,
        firm_name,
        poc,
        contact,
        success
      );
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const leadToCustomerValidation = [
  body("leadId").notEmpty().withMessage("Lead Id can not be Empty"),
];
router.post(
  "/leadToCustomer",
  leadToCustomerValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Validation Error");
    }
    try {
      const { leadId } = request.body;
      const leadToCustomerInstance = await new CustomerAndLeadService();
      const result = await leadToCustomerInstance.convertLeadIntoCustomer(
        leadId
      );
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const updateLeadInfoValidation = [
  body("leadId").notEmpty().withMessage("LeadId is required"),
  body("fieldName").notEmpty().withMessage("Field name is required"),
  body("fieldValue").notEmpty().withMessage("Field Value is required"),
];
router.post(
  "/updateLeadInfo",
  updateLeadInfoValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Validation Error");
    }
    try {
      const { leadId, fieldName, fieldValue } = request.body;
      const updateLeadInfoInstance = await new CustomerAndLeadService();
      const result = await updateLeadInfoInstance.updateLeadInfo(
        leadId,
        fieldName,
        fieldValue
      );
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const updateCustomerInfoValidation = [
  body("customerId").notEmpty().withMessage("LeadId is required"),
  body("fieldName").notEmpty().withMessage("Field name is required"),
  body("fieldValue").notEmpty().withMessage("Field Value is required"),
];
router.post(
  "/updateCustomerInfo",
  updateCustomerInfoValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Validation Error");
    }
    try {
      const { customerId, fieldName, fieldValue } = request.body;
      const updateLeadInfoInstance = await new CustomerAndLeadService();
      const result = await updateLeadInfoInstance.updateCustomerInfo(
        customerId,
        fieldName,
        fieldValue
      );
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

const deleteCustomerInfoValidation = [
  body("customerId").notEmpty().withMessage("LeadId is required"),
];
router.post(
  "/deleteCustomer",
  new AuthenticationMiddleware().isAdmin,
  deleteCustomerInfoValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Validation Error");
    }
    try {
      const { customerId } = request.body;
      const token = request.headers;
      const updateLeadInfoInstance = await new CustomerAndLeadService();
      const result = await updateLeadInfoInstance.deleteCustomer(
        customerId,
        token
      );
      response.status(200).send(result);
    } catch (error) {
      console.log(error);
      response.status(400).send(error);
    }
  }
);

export { router as LeadAndCustomerRoutes };
