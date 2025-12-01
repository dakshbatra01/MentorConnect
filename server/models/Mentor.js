const mongoose = require("mongoose");
const { Schema } = mongoose;

const mentorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expertise: [{ type: String }],
  bio: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  experience: { type: String, default: '' },
  availability: [{
    day: String,
    slots: [{ startTime: String, endTime: String }]
  }],
  rating: { type: Number, default: 0 },
  totalSessions: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 0 },
  languages: [{ type: String }],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: String
  }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  profileImage: { type: String, default: '' },
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' }
  }
}, { timestamps: true });

const Mentor = mongoose.model("Mentor", mentorSchema);
module.exports = Mentor;
