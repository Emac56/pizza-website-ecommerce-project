const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const db = require("../config/db");

// Signup
router.post("/signup", (req, res) => {
  const { username, name, email, phone, password } = req.body;

  // Basic validation
  if (!username || !name || !email || !password) {
    return res.status(400).json({ message: "Please provide username, name, email and password" });
  }

  const checkSql = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(checkSql, [email, username], (err, existingUser) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const sql = "INSERT INTO users (username, name, email, phone, password) VALUES (?, ?, ?, ?, ?)";
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(sql, [username, name, email, phone, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Signup failed" });
      }

      return res.json({ message: "User created successfully" });
    });
  });
});

// Login
router.post("/login", (req, res) => {
  const { loginInput, password } = req.body;

  if (!loginInput || !password) {
    return res.status(400).json({ message: "Please provide username/email and password" });
  }

  const sql = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(sql, [loginInput, loginInput], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Login failed" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Invalid username/email or password" });
    }

    const user = result[0];

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username/email or password" });
    }

    // Remove sensitive fields before sending to client
    const { password: _pw, ...safeUser } = user;

    return res.json({ message: "Login successful", user: safeUser });
  });
});

module.exports = router;
