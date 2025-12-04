const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // Hide password when finding users
    },
  },
  { timestamps: true }
);

// 🔐 Pre-save hook — Encrypt password before storing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // if password not changed, skip hashing

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// 🧩 Custom method to compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const adminLogin = mongoose.model("adminLogin", userSchema);
module.exports = adminLogin;
