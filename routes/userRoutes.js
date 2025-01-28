import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updateMyPassword,
} from "../controllers/authController.js";
import { deleteMe, getUsers, updateMe } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", protect, updateMyPassword);
router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

router.route("/getUsers").get(getUsers);

export { router };
