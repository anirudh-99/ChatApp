const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//name,email,password,passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "please tell us your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "please tell us your password"],
    minLength: 4,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      //this works only during Create and Save
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords are not same",
    },
  },
});

userSchema.pre("save", async function (next) {
  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //we don't need this field anymore to be stored in db
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("user", userSchema);
