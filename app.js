import express from "express";
import { router as productRouter } from "./routes/productRoutes.js";

export const app = express();

//ROUTE MIDDLEWARE
app.use("/api/v1/products", productRouter);
