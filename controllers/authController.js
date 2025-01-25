import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import catchAsync from "./catchAsync.js";
import CustomErrors from "../utils/customProductError.js";

const jwtToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordCreatedAt: req.body.passwordCreatedAt,
  });

  const token = jwtToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if the user has provided the email and password
  if (!email || !password)
    return next(new CustomErrors("Please enter email and password!", 401));

  //checking if the user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user)
    return next(new CustomErrors("There is no user with that email", 401));

  //comparing the user password
  const isPasswordCorrect = await user.comparePassword(password, user.password);
  if (!isPasswordCorrect)
    return next(new CustomErrors("Wrong email or password!", 401));

  //creating token
  const token = jwtToken(user.id);

  //sending response
  res.status(200).json({
    status: "success",
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
  //Getting token and checking if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return next(
      new CustomErrors("Token does not exist. Please login again", 40)
    );

  //Verifying token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //checking if the user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(
      new CustomErrors("The user with this token does not exist", 403)
    );

  if (currentUser.changedPassword(decoded.iat))
    return next(
      new CustomErrors(
        "User currently changed the password, please login again!",
        403
      )
    );

  next();
});

export { signup, login, protect };
