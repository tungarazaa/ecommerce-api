import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({ path: "./config.env" });

//CREATING A SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
