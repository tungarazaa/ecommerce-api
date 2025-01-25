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
  passwordCreatedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (
  providedPassword,
  userPassword
) {
  return await bcrypt.compare(providedPassword, userPassword);
};

userSchema.methods.changedPassword = function (tokenTime) {
  if (this.passwordCreatedAt) {
    const createdAt = parseInt(this.passwordCreatedAt.getTime() / 1000, 10);
    return tokenTime < createdAt;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

export default User;
