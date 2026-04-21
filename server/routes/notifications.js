const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const fetchuser = require("../middleware/fetchuser");

// Get all notifications for the user
router.get("/", fetchuser, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Mark notification as read
router.put("/:id/read", fetchuser, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        if (notification.userId.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        notification.read = true;
        await notification.save();
        res.json(notification);
    } catch (error) {
        console.error("Mark read error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Mark all as read
router.put("/read-all", fetchuser, async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, read: false },
            { $set: { read: true } }
        );
        res.json({ success: true });
    } catch (error) {
        console.error("Mark all read error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
