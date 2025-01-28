import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import { router as productRouter } from "./routes/productRoutes.js";
import CustomErrors from "./utils/customProductError.js";
import errorHandlerController from "./controllers/errorHandlerController.js";
import { router as userRouter } from "./routes/userRoutes.js";
const app = express();

//MIDDLEWARES

//preventing parameter polution
app.use(
  hpp({
    whiteList: ["title", "description", "category", "rating", "price"],
  })
);

//Setting security http headers
app.use(helmet());

app.use(express.json());

//Rate limit
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "Too many request sent from this IP, please try again after few hours",
});
app.use(limiter);

//Data sanitization
app.use(mongoSanitize());

//XSS
app.use(xss());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);

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
export default app;
