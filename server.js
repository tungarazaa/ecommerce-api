import dotenv from "dotenv";
import { app } from "./app.js";
import mongoose, { Mongoose } from "mongoose";

dotenv.config({ path: "./config.env" });

//CONNECTING TO DATABASE
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);
mongoose.connect(DB).then(() => console.log("Connected!"));

//CREATING A SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
