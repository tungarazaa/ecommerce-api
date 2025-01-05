import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Product from "../models/tourModel.js";

dotenv.config({ path: "./config.env" });
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, "utf-8"));

//CONNECT TO THE DATABASE
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);
mongoose.connect(DB).then(() => console.log("connected!"));

//IMPORTING AND DELETING DATA
const importData = async () => {
  try {
    await Product.create(data);
    console.log("Data created succesfully!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data deleted succesfully!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
