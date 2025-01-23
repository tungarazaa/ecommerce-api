import mongoose from "mongoose";
import validator from "validator";

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
});

const User = mongoose.model("User", userSchema);

export default User;
