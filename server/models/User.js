const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: String,
  role: { type: String, default: 'student' },
  email: { type: String, unique: true },
  password: String,
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  expertise: { type: [String], default: [] },
  hourlyRate: { type: Number, default: 0 },
}, { timestamps: true })


const User = mongoose.model("User", userSchema);
User.createIndexes();
module.exports = User;

