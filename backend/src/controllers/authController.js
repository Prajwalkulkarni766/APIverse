const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = new User({ firstName, lastName, email, password });
    await user.save();

    const secretKey = process.env.JWT_SECRET || "defaultSecret";
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "90h" });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const secretKey = process.env.JWT_SECRET || "defaultSecret";
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "90h" });
    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };
