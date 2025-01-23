import CustomErrors from "../utils/customProductError.js";

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const castErrorDB = (err) => {
  const message = `Invalid ID:${err.value}`;
  return new CustomErrors(message, 400);
};

const validationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid inputs: ${errors.join(". ")}`;
  return new CustomErrors(message, 400);
};

const duplicateErrorDB = (err) => {
  const value = err.errorResponse.errmsg.match(/"(.*?)"/)[0];
  const message = `Duplicate value: ${value}. Please change the field value`;
  return new CustomErrors(message, 400);
};
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") error = castErrorDB(error);
    if (err.name === "ValidationError") error = validationErrorDB(error);
    if (err.code === 11000) error = duplicateErrorDB(error);
    sendErrorProd(error, res);
  }
};
