import express from "express";
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists !!" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("✅ User registered successfully");

    res.json({ success: true, message: "User created hurrrayy" });
  } catch (error) {
    console.log("❌ Register error:", error);
    res.json({ success: false, message: "Signup error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Email does not exist!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password is not correct!" });
    }

    // ✅ Success
    return res.json({ success: true, message: "Logged in successfully!" });
  } catch (error) {
    console.error("❌ login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export { register ,login};
