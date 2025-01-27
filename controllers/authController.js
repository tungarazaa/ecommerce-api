import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import catchAsync from "./catchAsync.js";
import CustomErrors from "../utils/customProductError.js";
import sendEmail from "../utils/email.js";

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
    role: req.body.role,
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
      new CustomErrors("Token does not exist. Please login again", 401)
    );

  //Verifying token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //checking if the user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(
      new CustomErrors("The user with this token does not exist", 401)
    );

  if (currentUser.changedPassword(decoded.iat))
    return next(
      new CustomErrors(
        "User currently changed the password, please login again!",
        401
      )
    );
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new CustomErrors("You are not allowed to perform this action", 403)
      );
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  //Getting user using the email provided
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new CustomErrors("There is no user with that email", 404));

  //create resetToken
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //Send email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `You want to reset password? Click the link to reset. ${resetUrl}\n If you did not request this link, please ignore`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset password link. (Expires after 10 minutes)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    (user.passwordResetToken = undefined),
      (user.passwordResetExpires = undefined),
      await user.save({ validateBeforeSave: false });
    return next(
      new CustomErrors(
        "Could not send reset password link. Please try again after few minutes",
        500
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  //Getting user based on the token
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(new CustomErrors("Invalid token or token expired!", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = jwtToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

export { signup, login, protect, restrictTo, forgotPassword, resetPassword };
