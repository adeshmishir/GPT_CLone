// routes/userRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js"; // adjust path if needed
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // token lifetime

// Helper: create JWT
function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Middleware: verify JWT from cookie or Authorization header
export async function auth(req, res, next) {
  try {
    let token;

    // 1) Try cookie
    if (req.cookies && req.cookies.token) token = req.cookies.token;

    // 2) Fallback to Authorization header: Bearer <token>
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, JWT_SECRET);
    // attach user id to request
    req.userId = decoded.id;

    // optionally fetch user and attach (without password)
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/**
 * POST /api/users/signup
 * Body: { name, email, password }
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // Basic validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Name is required (min 2 chars)" });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check existing user
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    // Create user (User model pre-save hook should hash password)
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    await user.save();

    // create token
    const token = createToken({ id: user._id });

    // set cookie (httpOnly)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // return user without password
    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.status(201).json({ user: userSafe, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

/**
 * POST /api/users/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    // include password explicitly (schema had select: false)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken({ id: user._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.json({ user: userSafe, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

/**
 * POST /api/users/logout
 * Clears the cookie and returns a success message
 */
router.post("/logout", (req, res) => {
  // Clear cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
});

/**
 * GET /api/users/me
 * Protected route - returns the current user (without password)
 */
router.get("/me", auth, async (req, res) => {
  try {
    // auth middleware attached req.user
    res.json({ user: req.user });
  } catch (err) {
    console.error("Get /me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
