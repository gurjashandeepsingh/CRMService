import jwt from "jsonwebtoken";
import { Employee } from "../models/employeeModel.js";

class AuthenticationMiddleware {
  async generateToken(_id, tokens) {
    try {
      const token = await jwt.sign(
        { _id: _id.toString() },
        "jwtAuthenticationKey"
      );
      return token;
    } catch (error) {
      throw new Error(error);
    }
  }

  async isAuthenticate(request, response, next) {
    try {
      if (request.headers.token) {
        const verifiedToken = await jwt.verify(
          request.headers.token,
          "jwtAuthenticationKey"
        );
        request.user = { id: verifiedToken.id };
        return next();
      }
    } catch (error) {
      return response.status(401).send("Token invalid");
    }
    return response.status(401).send("Token not found in request");
  }

  async isAdmin(request, response, next) {
    try {
      if (request.headers.token) {
        const verifiedToken = await jwt.verify(
          request.headers.token,
          "jwtAuthenticationKey"
        );
        // request.user = { id: verifiedToken.id };
        const employee = await Employee.findById(verifiedToken._id);
        // const ifAdmin = await Employee.findOne({ _id: verifiedToken.id });
        if (employee.isAdmin == false) {
          throw new Error("You are not the admin");
        }
        return next();
      }
    } catch (error) {
      return response.status(401).send("Token invalid");
    }
  }
}

export { AuthenticationMiddleware };
