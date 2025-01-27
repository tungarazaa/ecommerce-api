import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name cannot be empty"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please enter a valid email!"],
    unique: true,
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin", "seller"],
      message: "The role can either be user,admin or seller",
    },
    default: "user",
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "Password cannot be empty"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    minlength: 8,
    required: [true, "Password Confirm cannot be empty"],
    validate: {
      validator: function (field) {
        return field === this.password;
      },
      message: "Password and the password confirm must be equal!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now + 1000;
  next();
});

userSchema.methods.comparePassword = async function (
  providedPassword,
  userPassword
) {
  return await bcrypt.compare(providedPassword, userPassword);
};

userSchema.methods.changedPassword = function (tokenTime) {
  if (this.passwordChangedAt) {
    const createdAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return tokenTime < createdAt;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
