const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// My secret keys for JWT token generation
const SecretKey = "ChotiGold$Arc";
const RefreshSecretKey = "ChotiGold$Arc$Refresh";
const fetchuser = require("../middleware/fetchuser");

// My signup route with comprehensive validation
router.post(
  "/signup",
  [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),

    body("email").isEmail().withMessage("Invalid email"),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
  ],

  async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await User.create({ 
        name, 
        email: email.toLowerCase(), 
        password: hashedPassword,
        role: role || 'student' 
      });
      const data = {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      
      // Generate access token (expires in 15 minutes)
      let authToken = jwt.sign(data, SecretKey, { expiresIn: '15m' });
      
      // Generate refresh token (expires in 7 days)
      let refreshToken = jwt.sign({ userId: user._id }, RefreshSecretKey, { expiresIn: '7d' });
      
      res.status(201).json({ 
        authToken, 
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error) {
      // I handle duplicate email error specifically
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists. Please use a different email." });
      }
      res.status(500).json({ error: error.message });
    }
  }
);

// My login route with validation
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const data = {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      
      // Generate access token (expires in 15 minutes)
      let authToken = jwt.sign(data, SecretKey, { expiresIn: '15m' });
      
      // Generate refresh token (expires in 7 days)
      let refreshToken = jwt.sign({ userId: user._id }, RefreshSecretKey, { expiresIn: '7d' });
      
      res.status(201).json({ 
        authToken, 
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh Token endpoint
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, RefreshSecretKey);
    const userId = decoded.userId;

    // Find user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Generate new access token
    const data = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
    
    const newAuthToken = jwt.sign(data, SecretKey, { expiresIn: '15m' });
    
    res.json({ authToken: newAuthToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

module.exports = router;
