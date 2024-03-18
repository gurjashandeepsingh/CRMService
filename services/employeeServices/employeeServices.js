import { Employee } from "../../models/employeeModel.js";
import bcrypt from "bcrypt";
import { Level } from "../../models/levelModel.js";
import { AuthenticationMiddleware } from "../../middleware/jwtMiddleware.js";

class EmployeeService {
  async registerEmployee(
    email,
    password,
    confirmPassword,
    name,
    levelId,
    parentId
  ) {
    if (password === confirmPassword) {
      const findParent = await Employee.findById(parentId);
      const parentLevel = await Level.findById(findParent.levelId);
      const employeeLevel = await Level.findById(levelId);
      console.log(parentLevel);
      console.log(employeeLevel);
      if (parentLevel.level < employeeLevel.level) {
        throw new Error("Only parent can add children");
      }
      const checkEmailExists = await Employee.findOne({ email: email });
      if (checkEmailExists) {
        throw new Error(" Email already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newEmployee = await new Employee({
        email: email,
        password: hashedPassword,
        name: name,
        levelId: levelId,
        parentId: findParent._id,
      });
      const savedUser = await newEmployee.save();
      return { savedUser };
    } else {
      throw new Error("Passwords do not match");
    }
  }

  async loginEmployee(email, password) {
    const checkCredentials = await Employee.findOne({ email: email });
    if (checkCredentials) {
      const isValid = await bcrypt.compare(password, checkCredentials.password);
      if (isValid) {
        const tokenInstance = await new AuthenticationMiddleware();
        const token = await tokenInstance.generateToken(checkCredentials._id);
        return { checkCredentials, token };
      } else {
        throw new Error("Invalid password");
      }
    } else {
      throw new Error("Email not found");
    }
  }

  async findEmployee(userId) {
    const employee = await Employee.findById(userId);
    if (!employee) {
      throw new Error("Employee not found");
    }
    return employee;
  }

  async updateEmployeeInfo(fieldName, fieldValue, id) {
    let newInfo;
    const OldInfo = await Employee.findOne({ _id: id.toString() });
    if (OldInfo) {
      newInfo = await Employee.updateOne(
        { _id: id },
        { $set: { [fieldName]: fieldValue } }
      );
      newInfo = await Employee.findOne({ _id: id.toString() });
      return { OldInfo, newInfo };
    }
    return "No User Found";
  }

  async deleteEmployee(employeeId, adminId) {
    const searchEmployee = await Employee.findOne({ _id: employeeId });
    const searchAdmin = await Employee.findOne({ _id: adminId });
    if (searchAdmin.isAdmin == false) {
      return "You are not authorized to perform this action";
    }
    const removeEmployee = await Employee.deleteOne({
      _id: searchEmployee._id,
    });
    if (!removeEmployee) {
      return "Error in deleting the employee";
    }
    return `Employee has been deleted successfully`;
  }

  async showEmployee(organizationNumber) {
    if (organizationNumber == "") {
      const allEmployees = await Level.find();
      return allEmployees;
    }
    const singleOrganisation = await Level.find({
      organization: organizationNumber,
    });
    return singleOrganisation;
  }

  async getLevel(employeeId) {
    const findEmployee = await Employee.findById(employeeId);
    const findLevel = await Level.findById(findEmployee.levelId);
    if (!findEmployee || !findLevel) {
      throw new Error("Employee not found");
    }
    return findLevel;
  }
}

export { EmployeeService };
