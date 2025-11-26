const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedbackSchema = new mongoose.Schema({
  sessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Session',
    required: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  mentorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    default: '' 
  },
  categories: {
    communication: { type: Number, min: 1, max: 5 },
    knowledge: { type: Number, min: 1, max: 5 },
    helpfulness: { type: Number, min: 1, max: 5 },
    professionalism: { type: Number, min: 1, max: 5 }
  },
  isPublic: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Index for faster queries
feedbackSchema.index({ mentorId: 1, createdAt: -1 });
feedbackSchema.index({ studentId: 1 });

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
