import dotenv from "dotenv";
import mongoose, { Mongoose } from "mongoose";

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception");
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });

import app from "./app.js";

//CONNECTING TO DATABASE
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);
mongoose.connect(DB).then(() => console.log("Connected!"));

//CREATING A SERVER
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
