//User Schema for mongoDb Database
const mongoose = require("mongoose");
// To Encrypt Password
const bcrypt = require("bcryptjs");
const {
  emailValidator,
  mobileNumberValidator,
  passwordValidator,
} = require("../utils/utils");

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    unique: true
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: [
      {
        validator: emailValidator,
        message: "Please enter a valid email address",
      },
    ],
  },
  mobileNumber: {
    type: String,
    required: false,
    validate:{
      validator: function (value) {
        // Allow empty or undefined values if optional
        if (!value) return true;
        return mobileNumberValidator(value);
      },
      message: "Please enter a valid 10-digit Indian mobile number",
    },
  },
  passWord: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: passwordValidator,
      message:
        "Password must be at least 8 characters long, contain at least 1 uppercase, 1 lowercase letter and 1 numeric character",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  demographics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DemographicsCollection"
  }
});

userSchema.pre("save", async function (next) {
  if (this.isModified("passWord") || this.isNew) {
    this.passWord = await bcrypt.hash(this.passWord, 10);
    // console.log('Hashed Password:', this.passWord);
  }
  next();
});

const UserCollection = mongoose.model("UserCollection", userSchema);

module.exports = UserCollection;
