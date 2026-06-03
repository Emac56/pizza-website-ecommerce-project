const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const db = require("../config/db");

router.post("/signup", async (req, res) => {

try {

const {
  username,
  name,
  email,
  phone,
  password
} = req.body;

const checkSql =
"SELECT * FROM users WHERE email = $1 OR username = $2";

const existingUser = await db.query(
  checkSql,
  [email, username]
);

if (existingUser.rows.length > 0) {

  return res.status(400).json({

    message:
    "Username or email already exists"

  });

}

const hashedPassword =
bcrypt.hashSync(password, 10);

const sql = `
  INSERT INTO users
  (
    username,
    name,
    email,
    phone,
    password
  )
  VALUES
  ($1, $2, $3, $4, $5)
`;

await db.query(sql, [

  username,
  name,
  email,
  phone,
  hashedPassword

]);

res.json({

  message:
  "User created successfully"

});

}

catch (err) {

console.log(err);

res.status(500).json({

  message:
  "Signup failed"

});

}

});

router.post("/login", async (req, res) => {

try {

const {
  loginInput,
  password
} = req.body;

const sql =
"SELECT * FROM users WHERE email = $1 OR username = $2";

const result = await db.query(
  sql,
  [loginInput, loginInput]
);

if (result.rows.length === 0) {

  return res.status(404).json({

    message:
    "Invalid username/email or password"

  });

}

const user = result.rows[0];

const isMatch =
bcrypt.compareSync(
  password,
  user.password
);

if (!isMatch) {

  return res.status(401).json({

    message:
    "Incorrect password"

  });

}

res.json({

  message:
  "Login successful",

  user

});

}

catch (err) {

console.log(err);

res.status(500).json({

  message:
  "Login failed"

});

}

});

module.exports = router;