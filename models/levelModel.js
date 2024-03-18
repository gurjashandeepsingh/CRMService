import mongoose from "mongoose";

const levelSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      require: true,
    },
    label: {
      type: String,
      require: true,
    },
    organization: {
      type: String,
      require: true,
    },
    organizationNumber: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

const Level = mongoose.model("Level", levelSchema);

export { Level };
