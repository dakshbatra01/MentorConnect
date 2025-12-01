const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Session = require("../models/Session");
const Feedback = require("../models/Feedback");

// ============================================
// USER MANAGEMENT ROUTES
// ============================================

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filters
// @access  Admin
router.get("/users", adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20, role, search, sortBy = 'createdAt', order = 'desc' } = req.query;

        // Build query
        const query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort
        const sort = {};
        sort[sortBy] = order === 'desc' ? -1 : 1;

        // Execute query with pagination
        const users = await User.find(query)
            .select('-password')
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            users,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   GET /api/admin/users/stats
// @desc    Get user statistics
// @access  Admin
router.get("/users/stats", adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalMentors = await User.countDocuments({ role: 'mentor' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        // New users this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

        // Get recent users
        const recentUsers = await User.find({ role: 'student' })
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalUsers,
            totalStudents,
            totalMentors,
            totalAdmins,
            newUsersThisMonth,
            recentUsers
        });
    } catch (error) {
        console.error("Get user stats error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   GET /api/admin/users/:id
// @desc    Get user details
// @access  Admin
router.get("/users/:id", adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get additional data based on role
        let additionalData = {};

        if (user.role === 'mentor') {
            const mentorProfile = await Mentor.findOne({ userId: user._id });
            const sessionsCount = await Session.countDocuments({ mentorId: user._id });
            additionalData = { mentorProfile, sessionsCount };
        } else if (user.role === 'student') {
            const sessionsCount = await Session.countDocuments({ studentId: user._id });
            const feedbackCount = await Feedback.countDocuments({ studentId: user._id });
            additionalData = { sessionsCount, feedbackCount };
        }

        res.json({ user, ...additionalData });
    } catch (error) {
        console.error("Get user details error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Change user role
// @access  Admin
router.put("/users/:id/role", adminAuth, async (req, res) => {
    try {
        const { role } = req.body;

        if (!['student', 'mentor', 'admin'].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User role updated successfully", user });
    } catch (error) {
        console.error("Update user role error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin
router.delete("/users/:id", adminAuth, async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ error: "Cannot delete your own account" });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Delete associated data
        if (user.role === 'mentor') {
            await Mentor.deleteOne({ userId: user._id });
            // Note: Consider what to do with sessions - maybe just mark as cancelled
            await Session.updateMany(
                { mentorId: user._id },
                { status: 'cancelled' }
            );
        } else if (user.role === 'student') {
            await Session.updateMany(
                { studentId: user._id },
                { status: 'cancelled' }
            );
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ============================================
// SESSION MANAGEMENT ROUTES
// ============================================

// @route   GET /api/admin/sessions
// @desc    Get all sessions with filters
// @access  Admin
router.get("/sessions", adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search, sortBy = 'date', order = 'desc' } = req.query;

        // Build query
        const query = {};
        if (status) query.status = status;

        // Build sort
        const sort = {};
        sort[sortBy] = order === 'desc' ? -1 : 1;

        // Execute query with pagination
        const sessions = await Session.find(query)
            .populate('studentId', 'name email')
            .populate('mentorId', 'name email')
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Session.countDocuments(query);

        res.json({
            sessions,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error("Get sessions error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   GET /api/admin/sessions/stats
// @desc    Get session statistics
// @access  Admin
router.get("/sessions/stats", adminAuth, async (req, res) => {
    try {
        const totalSessions = await Session.countDocuments();
        const pendingSessions = await Session.countDocuments({ status: 'pending' });
        const confirmedSessions = await Session.countDocuments({ status: 'confirmed' });
        const completedSessions = await Session.countDocuments({ status: 'completed' });
        const cancelledSessions = await Session.countDocuments({ status: 'cancelled' });

        // Sessions this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const sessionsThisMonth = await Session.countDocuments({ createdAt: { $gte: startOfMonth } });

        // Completion rate
        const completionRate = totalSessions > 0
            ? ((completedSessions / (completedSessions + cancelledSessions)) * 100).toFixed(1)
            : 0;

        res.json({
            totalSessions,
            pendingSessions,
            confirmedSessions,
            completedSessions,
            cancelledSessions,
            sessionsThisMonth,
            completionRate
        });
    } catch (error) {
        console.error("Get session stats error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   PUT /api/admin/sessions/:id/cancel
// @desc    Cancel session (admin override)
// @access  Admin
router.put("/sessions/:id/cancel", adminAuth, async (req, res) => {
    try {
        const { reason } = req.body;

        const session = await Session.findByIdAndUpdate(
            req.params.id,
            {
                status: 'cancelled',
                notes: `${session.notes || ''}\n[Admin cancelled: ${reason || 'No reason provided'}]`
            },
            { new: true }
        ).populate('studentId mentorId', 'name email');

        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.json({ message: "Session cancelled successfully", session });
    } catch (error) {
        console.error("Cancel session error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ============================================
// ANALYTICS ROUTES
// ============================================

// @route   GET /api/admin/analytics/overview
// @desc    Get dashboard overview statistics
// @access  Admin
router.get("/analytics/overview", adminAuth, async (req, res) => {
    try {
        // User stats
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalMentors = await User.countDocuments({ role: 'mentor' });

        // Session stats
        const totalSessions = await Session.countDocuments();
        const activeSessions = await Session.countDocuments({ status: 'confirmed' });
        const completedSessions = await Session.countDocuments({ status: 'completed' });
        const pendingSessions = await Session.countDocuments({ status: 'pending' });

        // Feedback stats
        const totalFeedback = await Feedback.countDocuments();
        const flaggedFeedback = await Feedback.countDocuments({ isFlagged: true });
        const avgRatingResult = await Feedback.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        const platformRating = avgRatingResult.length > 0
            ? avgRatingResult[0].avgRating.toFixed(1)
            : 0;

        // Growth data (last 7 days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const userCount = await User.countDocuments({
                createdAt: { $gte: date, $lt: nextDate }
            });

            last7Days.push({
                date: date.toISOString().split('T')[0],
                users: userCount
            });
        }

        res.json({
            users: { total: totalUsers, students: totalStudents, mentors: totalMentors },
            sessions: { total: totalSessions, active: activeSessions, completed: completedSessions, pending: pendingSessions },
            feedback: { total: totalFeedback, platformRating, flagged: flaggedFeedback },
            growthData: last7Days
        });
    } catch (error) {
        console.error("Get analytics overview error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ============================================
// MENTOR MANAGEMENT ROUTES
// ============================================

// @route   GET /api/admin/mentors
// @desc    Get all mentors with filters
// @access  Admin
router.get("/mentors", adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20, search, sortBy = 'rating', order = 'desc', featured } = req.query;

        // Get all users with mentor role
        const userQuery = { role: 'mentor' };
        if (search) {
            userQuery.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const mentorUsers = await User.find(userQuery).select('-password');
        const userIds = mentorUsers.map(u => u._id);

        // Get mentor profiles
        const mentorQuery = { userId: { $in: userIds } };
        if (featured !== undefined) mentorQuery.isFeatured = featured === 'true';

        const sort = {};
        sort[sortBy] = order === 'desc' ? -1 : 1;

        const mentors = await Mentor.find(mentorQuery)
            .populate('userId', 'name email createdAt')
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Mentor.countDocuments(mentorQuery);

        res.json({
            mentors,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error("Get mentors error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   GET /api/admin/mentors/stats
// @desc    Get mentor statistics
// @access  Admin
router.get("/mentors/stats", adminAuth, async (req, res) => {
    try {
        const totalMentors = await Mentor.countDocuments();
        const activeMentors = await Mentor.countDocuments({ isActive: true });
        const featuredMentors = await Mentor.countDocuments({ isFeatured: true });

        // Average rating
        const avgRatingResult = await Mentor.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating.toFixed(1) : 0;

        // Top mentors by rating
        const topMentors = await Mentor.find()
            .populate('userId', 'name email')
            .sort({ rating: -1 })
            .limit(5);

        // Expertise distribution
        const expertiseDistribution = await Mentor.aggregate([
            { $unwind: "$expertise" },
            { $group: { _id: "$expertise", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            totalMentors,
            activeMentors,
            featuredMentors,
            avgRating,
            topMentors,
            expertiseDistribution
        });
    } catch (error) {
        console.error("Get mentor stats error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   PUT /api/admin/mentors/:id/feature
// @desc    Feature/unfeature mentor
// @access  Admin
router.put("/mentors/:id/feature", adminAuth, async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.id);
        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found" });
        }

        mentor.isFeatured = !mentor.isFeatured;
        await mentor.save();

        res.json({
            message: `Mentor ${mentor.isFeatured ? 'featured' : 'unfeatured'} successfully`,
            mentor
        });
    } catch (error) {
        console.error("Feature mentor error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   PUT /api/admin/mentors/:id/suspend
// @desc    Suspend/activate mentor
// @access  Admin
router.put("/mentors/:id/suspend", adminAuth, async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.id);
        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found" });
        }

        mentor.isActive = !mentor.isActive;
        await mentor.save();

        res.json({
            message: `Mentor ${mentor.isActive ? 'activated' : 'suspended'} successfully`,
            mentor
        });
    } catch (error) {
        console.error("Suspend mentor error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ============================================
// FEEDBACK MANAGEMENT ROUTES
// ============================================

// @route   GET /api/admin/feedback
// @desc    Get all feedback with filters
// @access  Admin
router.get("/feedback", adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20, rating, sortBy = 'createdAt', order = 'desc' } = req.query;

        const query = {};
        if (rating) query.rating = parseInt(rating);

        const sort = {};
        sort[sortBy] = order === 'desc' ? -1 : 1;

        const feedback = await Feedback.find(query)
            .populate('studentId', 'name email')
            .populate('mentorId', 'name email')
            .populate('sessionId', 'topic date')
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Feedback.countDocuments(query);

        res.json({
            feedback,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error("Get feedback error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   DELETE /api/admin/feedback/:id
// @desc    Delete feedback
// @access  Admin
router.delete("/feedback/:id", adminAuth, async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);

        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }

        // Optionally recalculate mentor rating
        // This would require aggregating all remaining feedback for the mentor

        res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
        console.error("Delete feedback error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   GET /api/admin/feedback/stats
// @desc    Get feedback statistics
// @access  Admin
router.get("/feedback/stats", adminAuth, async (req, res) => {
    try {
        const totalFeedback = await Feedback.countDocuments();

        // Rating distribution
        const ratingDistribution = await Feedback.aggregate([
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        // Average rating
        const avgRatingResult = await Feedback.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating.toFixed(1) : 0;

        // Recent feedback
        const recentFeedback = await Feedback.find()
            .populate('studentId mentorId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalFeedback,
            avgRating,
            ratingDistribution,
            recentFeedback
        });
    } catch (error) {
        console.error("Get feedback stats error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
