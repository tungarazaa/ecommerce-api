import User from "../models/userModel.js";
import CustomErrors from "../utils/customProductError.js";
import catchAsync from "./catchAsync.js";

const updateMe = catchAsync(async (req, res, next) => {
  //Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new CustomErrors("Sorry, you cannot update password on this route!", 400)
    );

  //Update user document
  const fields = ["name", "email"];
  const newObj = {};
  Object.keys(req.body).forEach((el) => {
    if (fields.includes(el)) newObj[el] = req.body[el];
  });

  const updatedUser = await User.findByIdAndUpdate(req.user._id, newObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  //Find User By Id
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
});

export { updateMe, deleteMe, getUsers };
