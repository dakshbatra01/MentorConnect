const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: String,
  role: { type: String, default: 'student' },
  email: { type: String, unique: true },
  password: String,
}, { timestamps: true })


const User = mongoose.model("User", userSchema);
User.createIndexes();
module.exports = User;

