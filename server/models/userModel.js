const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Static Signup Method
userSchema.statics.signup = async function (email, password) {
  // Validation
  if (!email || !password) {
    throw Error("Please enter both an email and password");
  }
  if (!validator.isEmail(email)) {
    throw Error("Please enter a valid email!");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Please enter a strong password!");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error(`Email ${email} already exists`);
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

// Static Login method
userSchema.statics.login = async function (email, password) {
  // Validation
  if (!email || !password) {
    throw Error("Please enter both an email and password");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Invalid Email!");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Invalid Password!");
  };

  return user;
};

module.exports = mongoose.model("User", userSchema);
