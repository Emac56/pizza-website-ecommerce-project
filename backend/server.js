require("dotenv").config();

const express = require("express");
const cors = require("cors");

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

const userId = req.params.id;

const result = await db.query(
  "SELECT name, phone FROM users WHERE id = $1",
  [userId]
);

if (result.rows.length === 0) {
  return res.status(404).json({
    message: "User not found"
  });
}

res.json(result.rows[0]);

} catch (error) {

console.log(error);

return res.status(500).json({
  message: "Server error"
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

if (!items || items.length === 0) {
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

const orderId = orderResult.rows[0].id;

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

return res.json({
  message: "Order saved successfully",
  order_id: orderId
});

} catch (error) {

await db.query("ROLLBACK").catch(() => {});

console.log(error);

return res.status(500).json({
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

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});