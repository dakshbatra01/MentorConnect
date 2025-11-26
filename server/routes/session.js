const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const Mentor = require("../models/Mentor");
const fetchuser = require("../middleware/fetchuser");

// Book a session
router.post("/book", fetchuser, async (req, res) => {
  try {
    const studentId = req.user.id;
    const { mentorId, date, startTime, endTime, topic, notes } = req.body;

    // Verify mentor exists
    const mentorProfile = await Mentor.findOne({ userId: mentorId });
    if (!mentorProfile) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Create session
    const session = await Session.create({
      studentId,
      mentorId,
      date,
      startTime,
      endTime,
      topic,
      notes: notes || ''
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all sessions for logged-in user with pagination
router.get("/my-sessions", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      status, 
      role, 
      page = 1, 
      limit = 10,
      sortBy = 'date',
      order = 'desc'
    } = req.query;

    let query = {
      $or: [
        { studentId: userId },
        { mentorId: userId }
      ]
    };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by role (as student or mentor)
    if (role === 'student') {
      query = { studentId: userId };
      if (status) query.status = status;
    } else if (role === 'mentor') {
      query = { mentorId: userId };
      if (status) query.status = status;
    }

    // Sorting
    let sortOptions = {};
    if (sortBy === 'date') {
      sortOptions.date = order === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = order === 'asc' ? 1 : -1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sessions = await Session.find(query)
      .populate('studentId', 'name email')
      .populate('mentorId', 'name email')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get session by ID
router.get("/:id", fetchuser, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('studentId', 'name email')
      .populate('mentorId', 'name email');

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Verify user is part of the session
    if (session.studentId._id.toString() !== req.user.id && 
        session.mentorId._id.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update session status
router.put("/:id/status", fetchuser, async (req, res) => {
  try {
    const { status } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Verify user is the mentor
    if (session.mentorId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Only the mentor can update session status" });
    }

    session.status = status;
    await session.save();

    // Update mentor's total sessions if completed
    if (status === 'completed') {
      await Mentor.findOneAndUpdate(
        { userId: session.mentorId },
        { $inc: { totalSessions: 1 } }
      );
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add rating and feedback
router.put("/:id/feedback", fetchuser, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Verify user is the student
    if (session.studentId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Only the student can provide feedback" });
    }

    // Verify session is completed
    if (session.status !== 'completed') {
      return res.status(400).json({ error: "Can only rate completed sessions" });
    }

    session.rating = rating;
    session.feedback = feedback || '';
    await session.save();

    // Update mentor's average rating
    const mentorSessions = await Session.find({
      mentorId: session.mentorId,
      status: 'completed',
      rating: { $exists: true, $ne: null }
    });

    const avgRating = mentorSessions.reduce((sum, s) => sum + s.rating, 0) / mentorSessions.length;
    
    await Mentor.findOneAndUpdate(
      { userId: session.mentorId },
      { rating: avgRating }
    );

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel session
router.delete("/:id", fetchuser, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Verify user is part of the session
    if (session.studentId.toString() !== req.user.id && 
        session.mentorId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    session.status = 'cancelled';
    await session.save();

    res.json({ message: "Session cancelled successfully", session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update session details
router.put("/:id", fetchuser, async (req, res) => {
  try {
    const { date, startTime, endTime, topic, notes, meetingLink } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Verify user is the mentor
    if (session.mentorId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Only the mentor can update session details" });
    }

    if (date) session.date = date;
    if (startTime) session.startTime = startTime;
    if (endTime) session.endTime = endTime;
    if (topic) session.topic = topic;
    if (notes !== undefined) session.notes = notes;
    if (meetingLink !== undefined) session.meetingLink = meetingLink;

    await session.save();

    const updatedSession = await Session.findById(session._id)
      .populate('studentId', 'name email')
      .populate('mentorId', 'name email');

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get session statistics for user
router.get("/stats/me", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sessions = await Session.find({
      $or: [{ studentId: userId }, { mentorId: userId }]
    });

    const stats = {
      total: sessions.length,
      pending: sessions.filter(s => s.status === 'pending').length,
      confirmed: sessions.filter(s => s.status === 'confirmed').length,
      completed: sessions.filter(s => s.status === 'completed').length,
      cancelled: sessions.filter(s => s.status === 'cancelled').length,
      asStudent: sessions.filter(s => s.studentId.toString() === userId).length,
      asMentor: sessions.filter(s => s.mentorId.toString() === userId).length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
