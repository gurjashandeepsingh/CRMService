import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    levelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      require: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      require: true,
    },
    parentId: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", userSchema);

export { Employee };
