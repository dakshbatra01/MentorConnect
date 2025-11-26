const express = require("express");
const router = express.Router();
const Mentor = require("../models/Mentor");
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");

// Get all mentors with advanced filtering, sorting, and pagination
router.get("/all", async (req, res) => {
  try {
    const { 
      expertise, 
      minRating, 
      maxRate, 
      minRate,
      experience,
      search,
      sortBy = 'rating',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    let query = { isActive: true };

    // Filter by expertise/domain
    if (expertise) {
      query.expertise = { $in: [expertise] };
    }

    // Filter by rating range
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Filter by hourly rate range
    if (maxRate || minRate) {
      query.hourlyRate = {};
      if (maxRate) query.hourlyRate.$lte = parseFloat(maxRate);
      if (minRate) query.hourlyRate.$gte = parseFloat(minRate);
    }

    // Filter by experience level
    if (experience) {
      query.experience = { $regex: experience, $options: 'i' };
    }

    // Search by name or skill
    if (search) {
      const users = await User.find({ 
        name: { $regex: search, $options: 'i' } 
      }).select('_id');
      
      const userIds = users.map(u => u._id);
      
      query.$or = [
        { userId: { $in: userIds } },
        { expertise: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions.rating = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'experience') {
      sortOptions.totalSessions = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'rate') {
      sortOptions.hourlyRate = order === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = order === 'asc' ? 1 : -1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const mentors = await Mentor.find(query)
      .populate('userId', 'name email')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Mentor.countDocuments(query);

    res.json({
      mentors,
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

// Get mentor by ID
router.get("/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('userId', 'name email');

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json(mentor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update mentor profile
router.post("/profile", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (user.role !== 'mentor') {
      return res.status(403).json({ error: "Only mentors can create mentor profiles" });
    }

    const {
      expertise,
      bio,
      experience,
      availability,
      hourlyRate,
      languages,
      education,
      certifications,
      profileImage,
      socialLinks
    } = req.body;

    let mentor = await Mentor.findOne({ userId });

    if (mentor) {
      // Update existing profile
      mentor.expertise = expertise || mentor.expertise;
      mentor.bio = bio || mentor.bio;
      mentor.experience = experience || mentor.experience;
      mentor.availability = availability || mentor.availability;
      mentor.hourlyRate = hourlyRate !== undefined ? hourlyRate : mentor.hourlyRate;
      mentor.languages = languages || mentor.languages;
      mentor.education = education || mentor.education;
      mentor.certifications = certifications || mentor.certifications;
      mentor.profileImage = profileImage || mentor.profileImage;
      mentor.socialLinks = socialLinks || mentor.socialLinks;
      
      await mentor.save();
    } else {
      // Create new profile
      mentor = await Mentor.create({
        userId,
        expertise: expertise || [],
        bio: bio || '',
        experience: experience || '',
        availability: availability || [],
        hourlyRate: hourlyRate || 0,
        languages: languages || [],
        education: education || [],
        certifications: certifications || [],
        profileImage: profileImage || '',
        socialLinks: socialLinks || {}
      });
    }

    res.json(mentor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mentor profile for logged-in mentor
router.get("/profile/me", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const mentor = await Mentor.findOne({ userId })
      .populate('userId', 'name email');

    if (!mentor) {
      return res.status(404).json({ error: "Mentor profile not found" });
    }

    res.json(mentor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete mentor profile
router.delete("/profile", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const mentor = await Mentor.findOneAndDelete({ userId });

    if (!mentor) {
      return res.status(404).json({ error: "Mentor profile not found" });
    }

    res.json({ message: "Mentor profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update mentor availability
router.put("/availability", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { availability } = req.body;

    const mentor = await Mentor.findOneAndUpdate(
      { userId },
      { availability },
      { new: true }
    ).populate('userId', 'name email');

    if (!mentor) {
      return res.status(404).json({ error: "Mentor profile not found" });
    }

    res.json(mentor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle mentor active status
router.put("/toggle-status", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const mentor = await Mentor.findOne({ userId });

    if (!mentor) {
      return res.status(404).json({ error: "Mentor profile not found" });
    }

    mentor.isActive = !mentor.isActive;
    await mentor.save();

    res.json({ 
      message: `Mentor profile ${mentor.isActive ? 'activated' : 'deactivated'} successfully`,
      mentor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mentor statistics
router.get("/stats/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const Session = require("../models/Session");
    const Feedback = require("../models/Feedback");

    const sessions = await Session.find({ mentorId: mentor.userId });
    const feedback = await Feedback.find({ mentorId: mentor.userId, isPublic: true });

    const stats = {
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.status === 'completed').length,
      pendingSessions: sessions.filter(s => s.status === 'pending').length,
      cancelledSessions: sessions.filter(s => s.status === 'cancelled').length,
      averageRating: mentor.rating,
      totalFeedback: feedback.length,
      recentFeedback: feedback.slice(0, 5)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
