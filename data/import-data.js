import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Product from "../models/productModel.js";

dotenv.config({ path: "./config.env" });

const __dirname = path.resolve(
  path
    .dirname(decodeURI(new URL(import.meta.url).pathname))
    .replace(/^\/([a-zA-Z]:)/, "$1")
);
const dataPath = path.join(__dirname, "data.json");

// // Ensure data.json exists
// if (!fs.existsSync(dataPath)) {
//   console.error(`Error: File not found at ${dataPath}`);
//   process.exit(1);
// }

const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// CONNECT TO THE DATABASE
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log("Database connection successful!"))
  .catch((err) => {
    console.error("Database connection failed!", err);
    process.exit(1);
  });

// IMPORT AND DELETE DATA
const importData = async () => {
  try {
    await Product.create(data);
    console.log("Data imported successfully!");
  } catch (err) {
    console.error("Data import failed:", err);
  } finally {
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data deleted successfully!");
  } catch (err) {
    console.error("Data deletion failed:", err);
  } finally {
    process.exit();
  }
};

// Script Execution
const action = process.argv[2];
if (action === "--import") {
  importData();
} else if (action === "--delete") {
  deleteData();
} else {
  console.error(
    "Invalid command! Use '--import' to import data or '--delete' to delete data."
  );
  process.exit(1);
}
