import express from "express";
import { router as productRouter } from "./routes/productRoutes.js";

export const app = express();

//MIDDLEWARES
app.use(express.json());
app.use("/api/v1/products", productRouter);
