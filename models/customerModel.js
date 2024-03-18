import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
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
  },
  { timestamps: true }
);

const Customer = new mongoose.model("Customer", customerSchema);

export { Customer };
