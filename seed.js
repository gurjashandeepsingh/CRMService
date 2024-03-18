import mongoose from "mongoose";
import { Level } from "./models/levelModel.js"; // Import your Mongoose model

// Define MongoDB connection URL
const mongoURI = "mongodb://127.0.0.1:27017/CRMSoftware";

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    // Define data to seed
    const dataToSeed = [
      {
        level: 1,
        label: "Junior",
        organization: "ABC Corp",
        organizationNumber: 1,
      },
      {
        level: 2,
        label: "Intermediate",
        organization: "ABC Corp",
        organizationNumber: 1,
      },
      {
        level: 3,
        label: "Senior",
        organization: "ABC Corp",
        organizationNumber: 1,
      },
      {
        level: 4,
        label: "Manager",
        organization: "ABC Corp",
        organizationNumber: 1,
      },
    ];

    // Insert data into the database
    Level.insertMany(dataToSeed)
      .then(() => {
        console.log("Data seeded successfully");
        // Disconnect from MongoDB after seeding
        mongoose.disconnect();
      })
      .catch((err) => console.error("Error seeding data:", err));
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
