import User from "../models/userModel.js";
import catchAsync from "./catchAsync.js";

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

export { signup };
