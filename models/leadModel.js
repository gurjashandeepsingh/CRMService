import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      require: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    firm_name: {
      type: String,
      required: true,
    },
    poc: {
      type: String,
      require: true,
    },
    contact: {
      type: Number,
      require: true,
    },
    success: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export { Lead };
