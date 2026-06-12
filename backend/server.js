require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const pizzaRoutes = require("./routes/pizzaRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pizzas", pizzaRoutes);

app.get("/", (req, res) => {
res.send("Golden Crust API running");
});

app.get("/health", (req, res) => {
res.json({
status: "ok"
});
});

app.get("/api/users/:id", async (req, res) => {

try {

const { id } = req.params;

const result = await db.query(
  `
  SELECT
    id,
    name,
    phone
  FROM users
  WHERE id = $1
  `,
  [id]
);

if (result.rows.length === 0) {

  return res.status(404).json({
    message: "User not found"
  });

}

res.json(result.rows[0]);

} catch (error) {

console.error(error);

res.status(500).json({
  message: "Server error"
});

}

});

app.put("/api/users/:id", async (req, res) => {

try {

const { id } = req.params;

const {
  name,
  phone
} = req.body;

if (!name || !phone) {

  return res.status(400).json({
    message: "Name and phone are required"
  });

}

const result = await db.query(
  `
  UPDATE users
  SET
    name = $1,
    phone = $2
  WHERE id = $3
  RETURNING
    id,
    username,
    name,
    email,
    phone,
    created_at
  `,
  [
    name.trim(),
    phone.trim(),
    id
  ]
);

if (result.rows.length === 0) {

  return res.status(404).json({
    message: "User not found"
  });

}

res.json({
  message: "Profile updated",
  user: result.rows[0]
});

} catch (error) {

console.error(error);

res.status(500).json({
  message: "Server error"
});

}

});

app.put("/api/users/:id/password", async (req, res) => {

try {

const { id } = req.params;

const {
  currentPassword,
  newPassword
} = req.body;

if (!currentPassword || !newPassword) {

  return res.status(400).json({
    message: "All password fields are required"
  });

}

if (newPassword.length < 6) {

  return res.status(400).json({
    message: "Password must be at least 6 characters"
  });

}

const userResult = await db.query(
  `
  SELECT password
  FROM users
  WHERE id = $1
  `,
  [id]
);

if (userResult.rows.length === 0) {

  return res.status(404).json({
    message: "User not found"
  });

}

const validPassword =
  await bcrypt.compare(
    currentPassword,
    userResult.rows[0].password
  );

if (!validPassword) {

  return res.status(400).json({
    message: "Current password is incorrect"
  });

}

const hashedPassword =
  await bcrypt.hash(
    newPassword,
    10
  );

await db.query(
  `
  UPDATE users
  SET password = $1
  WHERE id = $2
  `,
  [
    hashedPassword,
    id
  ]
);

res.json({
  message: "Password updated successfully"
});

} catch (error) {

console.error(error);

res.status(500).json({
  message: "Server error"
});

}

});

app.put("/api/users/:id/password", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      currentPassword,
      newPassword
    } = req.body;

    const userResult =
      await db.query(
        `
        SELECT password
        FROM users
        WHERE id = $1
        `,
        [id]
      );

    if (
      userResult.rows.length === 0
    ) {

      return res.status(404).json({
        message:
          "User not found"
      });

    }

    const validPassword =
      await bcrypt.compare(
        currentPassword,
        userResult.rows[0].password
      );

    if (!validPassword) {

      return res.status(400).json({
        message:
          "Current password is incorrect"
      });

    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    await db.query(
      `
      UPDATE users
      SET password = $1
      WHERE id = $2
      `,
      [
        hashedPassword,
        id
      ]
    );

    res.json({
      message:
        "Password updated successfully"
    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server error"
    });

  }

});

app.post("/api/orders", async (req, res) => {

try {

const {
  user_id,
  full_name,
  phone_number,
  street_address,
  city,
  zip_code,
  payment_method,
  payment_details,
  items
} = req.body;

if (!user_id) {

  return res.status(400).json({
    message: "User ID is required"
  });

}

if (!Array.isArray(items) || items.length === 0) {

  return res.status(400).json({
    message: "Cart is empty"
  });

}

await db.query("BEGIN");

const orderResult = await db.query(
  `
  INSERT INTO orders
  (
    user_id,
    full_name,
    phone_number,
    street_address,
    city,
    zip_code,
    payment_method,
    payment_details
  )
  VALUES
  ($1,$2,$3,$4,$5,$6,$7,$8)
  RETURNING id
  `,
  [
    user_id,
    full_name,
    phone_number,
    street_address,
    city,
    zip_code,
    payment_method,
    payment_details
  ]
);

const orderId =
  orderResult.rows[0].id;

for (const item of items) {

  await db.query(
    `
    INSERT INTO order_items
    (
      order_id,
      pizza_id,
      quantity,
      price
    )
    VALUES
    ($1,$2,$3,$4)
    `,
    [
      orderId,
      item.id,
      item.quantity,
      item.price
    ]
  );

}

await db.query("COMMIT");

res.json({
  message: "Order saved successfully",
  order_id: orderId
});

} catch (error) {

await db.query("ROLLBACK").catch(() => {});

console.error(error);

res.status(500).json({
  message: "Order failed"
});

}

});

app.get("/api/orders/user/:userId", async (req, res) => {

try {

const { userId } = req.params;

const result = await db.query(
  `
  SELECT *
  FROM orders
  WHERE user_id = $1
  ORDER BY created_at DESC
  `,
  [userId]
);

res.json(result.rows);

} catch (error) {

console.error(error);

res.status(500).json({
  message: "Server error"
});

}

});

app.get("/api/orders/:orderId/items", async (req, res) => {

try {

const { orderId } = req.params;

const result = await db.query(
  `
  SELECT
    oi.quantity,
    oi.price,
    p.name
  FROM order_items oi
  JOIN pizzas p
  ON oi.pizza_id = p.id
  WHERE oi.order_id = $1
  `,
  [orderId]
);

res.json(result.rows);

} catch (error) {

console.error(error);

res.status(500).json({
  message: "Server error"
});

}

});

app.get("/api/orders/:id", async (req, res) => {

try {

const { id } = req.params;

const result = await db.query(
  `
  SELECT *
  FROM orders
  WHERE id = $1
  `,
  [id]
);

if (result.rows.length === 0) {

  return res.status(404).json({
    message: "Order not found"
  });

}

res.json(result.rows[0]);

} catch (error) {

console.error(error);

res.status(500).json({
  message: "Server error"
});

}

});

const PORT =
process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(
"Server running on port ${PORT}"
);
});