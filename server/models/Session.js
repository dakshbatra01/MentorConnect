const mongoose = require("mongoose");
const { Schema } = mongoose;

const sessionSchema = new mongoose.Schema({
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
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending' 
  },
  topic: { type: String, required: true },
  notes: { type: String, default: '' },
  meetingLink: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String, default: '' }
}, { timestamps: true });

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
