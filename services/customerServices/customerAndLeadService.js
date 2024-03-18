import { Customer } from "../../models/customerModel.js";
import { Employee } from "../../models/employeeModel.js";
import { Lead } from "../../models/leadModel.js";

class CustomerAndLeadService {
  async registerLead(employeeId, firm_name, poc, contact, success) {
    const findEmployee = await Employee.findOne({ _id: employeeId });
    const newLead = await Lead.create({
      employeeId,
      employeeName: findEmployee.name,
      firm_name,
      poc,
      contact,
      success: false,
    });
    if (!newLead) {
      throw new Error("Error in creating Lead");
    }
    return newLead;
  }

  async convertLeadIntoCustomer(leadId) {
    let leadDetails = await Lead.findOneAndUpdate(
      { _id: leadId },
      { success: true },
      { new: true }
    );
    if (!leadDetails) {
      throw new Error("Lead not found");
    }
    let newCustomer = await Customer.create({
      username: leadDetails.employeeName,
      firm_name: leadDetails.firm_name,
      poc: leadDetails.poc,
      contact: leadDetails.contact,
    });
    return { newCustomer, leadDetails };
  }

  async updateLeadInfo(leadId, fieldName, fieldValue) {
    const updateData = {};
    updateData[fieldName] = fieldValue;
    const findLead = await Lead.findOneAndUpdate({ _id: leadId }, updateData, {
      new: true,
    });
    if (!findLead) {
      throw new Error("Can't find and update lead");
    }
    return findLead;
  }

  async updateCustomerInfo(customerId, fieldName, fieldValue) {
    const updatedCustomer = {};
    updatedCustomer[fieldName] = fieldValue;
    const updatedCustomerInfo = await Customer.findOneAndUpdate(
      { _id: customerId },
      updatedCustomer,
      { new: true }
    );
    return updatedCustomerInfo;
  }

  async deleteCustomer(customerId) {
    const deletedCustomer = await Customer.findOneAndDelete({
      _id: customerId,
    });
    if (!deletedCustomer) {
      throw new Error("Can not delete Customer");
    }
    return deletedCustomer;
  }
}

export { CustomerAndLeadService };
