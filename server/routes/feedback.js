const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const Session = require("../models/Session");
const Mentor = require("../models/Mentor");
const fetchuser = require("../middleware/fetchuser");

// Create feedback for a session
router.post("/create", fetchuser, async (req, res) => {
  try {
    const studentId = req.user.id;
    const { sessionId, mentorId, rating, comment, categories, isPublic } = req.body;

    // Verify session exists and is completed
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ error: "Can only provide feedback for completed sessions" });
    }

    if (session.studentId.toString() !== studentId) {
      return res.status(403).json({ error: "You can only provide feedback for your own sessions" });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ sessionId });
    if (existingFeedback) {
      return res.status(400).json({ error: "Feedback already provided for this session" });
    }

    // Create feedback
    const feedback = await Feedback.create({
      sessionId,
      studentId,
      mentorId,
      rating,
      comment: comment || '',
      categories: categories || {},
      isPublic: isPublic !== undefined ? isPublic : true
    });

    // Update session with rating and feedback
    session.rating = rating;
    session.feedback = comment || '';
    await session.save();

    // Update mentor's average rating
    const allFeedback = await Feedback.find({ mentorId });
    const avgRating = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;
    
    await Mentor.findOneAndUpdate(
      { userId: mentorId },
      { 
        rating: parseFloat(avgRating.toFixed(1)),
        $inc: { totalSessions: 1 }
      }
    );

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('studentId', 'name email')
      .populate('mentorId', 'name email')
      .populate('sessionId');

    res.status(201).json(populatedFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all feedback for a mentor
router.get("/mentor/:mentorId", async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { page = 1, limit = 10, minRating } = req.query;

    let query = { mentorId, isPublic: true };
    
    if (minRating) {
      query.rating = { $gte: parseInt(minRating) };
    }

    const feedback = await Feedback.find(query)
      .populate('studentId', 'name')
      .populate('sessionId', 'topic date')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Feedback.countDocuments(query);

    res.json({
      feedback,
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

// Get all feedback by a student
router.get("/my-feedback", fetchuser, async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const feedback = await Feedback.find({ studentId })
      .populate('mentorId', 'name email')
      .populate('sessionId', 'topic date')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update feedback
router.put("/:id", fetchuser, async (req, res) => {
  try {
    const { rating, comment, categories, isPublic } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    // Verify user is the student who created the feedback
    if (feedback.studentId.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only update your own feedback" });
    }

    // Update fields
    if (rating) feedback.rating = rating;
    if (comment !== undefined) feedback.comment = comment;
    if (categories) feedback.categories = { ...feedback.categories, ...categories };
    if (isPublic !== undefined) feedback.isPublic = isPublic;

    await feedback.save();

    // Recalculate mentor's average rating
    const allFeedback = await Feedback.find({ mentorId: feedback.mentorId });
    const avgRating = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;
    
    await Mentor.findOneAndUpdate(
      { userId: feedback.mentorId },
      { rating: parseFloat(avgRating.toFixed(1)) }
    );

    // Update session rating
    await Session.findByIdAndUpdate(
      feedback.sessionId,
      { rating, feedback: comment }
    );

    const updatedFeedback = await Feedback.findById(feedback._id)
      .populate('studentId', 'name email')
      .populate('mentorId', 'name email')
      .populate('sessionId');

    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete feedback
router.delete("/:id", fetchuser, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    // Verify user is the student who created the feedback
    if (feedback.studentId.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only delete your own feedback" });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    // Recalculate mentor's average rating
    const allFeedback = await Feedback.find({ mentorId: feedback.mentorId });
    const avgRating = allFeedback.length > 0 
      ? allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length 
      : 0;
    
    await Mentor.findOneAndUpdate(
      { userId: feedback.mentorId },
      { rating: parseFloat(avgRating.toFixed(1)) }
    );

    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get feedback statistics for a mentor
router.get("/stats/:mentorId", async (req, res) => {
  try {
    const { mentorId } = req.params;

    const feedback = await Feedback.find({ mentorId, isPublic: true });

    if (feedback.length === 0) {
      return res.json({
        totalFeedback: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        categoryAverages: {
          communication: 0,
          knowledge: 0,
          helpfulness: 0,
          professionalism: 0
        }
      });
    }

    const totalFeedback = feedback.length;
    const averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedback.forEach(f => {
      ratingDistribution[f.rating]++;
    });

    const categoryAverages = {
      communication: 0,
      knowledge: 0,
      helpfulness: 0,
      professionalism: 0
    };

    let categoryCount = 0;
    feedback.forEach(f => {
      if (f.categories) {
        if (f.categories.communication) {
          categoryAverages.communication += f.categories.communication;
          categoryCount++;
        }
        if (f.categories.knowledge) {
          categoryAverages.knowledge += f.categories.knowledge;
        }
        if (f.categories.helpfulness) {
          categoryAverages.helpfulness += f.categories.helpfulness;
        }
        if (f.categories.professionalism) {
          categoryAverages.professionalism += f.categories.professionalism;
        }
      }
    });

    if (categoryCount > 0) {
      Object.keys(categoryAverages).forEach(key => {
        categoryAverages[key] = parseFloat((categoryAverages[key] / categoryCount).toFixed(1));
      });
    }

    res.json({
      totalFeedback,
      averageRating: parseFloat(averageRating.toFixed(1)),
      ratingDistribution,
      categoryAverages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
