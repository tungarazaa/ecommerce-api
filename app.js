import express from "express";
import { router as productRouter } from "./routes/productRoutes.js";
import CustomErrors from "./utils/customProductError.js";
import errorHandlerController from "./controllers/errorHandlerController.js";
export const app = express();

//MIDDLEWARES
app.use(express.json());
app.use("/api/v1/products", productRouter);

//HANDLING UNMATCHED ROUTES
app.all("*", (req, res, next) => {
  const err = new CustomErrors(
    `Could not find ${req.originalUrl} on the server`,
    404
  );
  next(err);
});

//ERROR HANDLING MIDDLEWARE
app.use(errorHandlerController);
