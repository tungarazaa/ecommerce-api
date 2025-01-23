import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import catchAsync from "./catchAsync.js";

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

export { signup };
