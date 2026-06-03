Replace your WHOLE:

backend/server.js

with THIS 😄🔥

require("dotenv").config();

const express = require("express");

const cors = require("cors");

const db =
require("./config/db");

const authRoutes =
require("./routes/authRoutes");

const pizzaRoutes =
require("./routes/pizzaRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/pizzas", pizzaRoutes);

app.get("/", (req, res) => {

res.send(
"Golden Crust API running"
);

});

app.get("/api/users/:id", async (req, res) => {

try {

const userId =
req.params.id;

const sql =
"SELECT name, phone FROM users WHERE id = $1";

const result =
await db.query(
  sql,
  [userId]
);

if (
  result.rows.length === 0
) {

  return res.status(404).json({

    message:
    "User not found"

  });

}

res.json(
  result.rows[0]
);

}

catch (error) {

console.log(error);

return res.status(500).json({

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

  payment_details

} = req.body;

const sql = `
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

  ($1, $2, $3, $4, $5, $6, $7, $8)
`;

await db.query(
  sql,
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

res.json({

  message:
  "Order saved successfully"

});

}

catch (error) {

console.log(error);

return res.status(500).json({

  message:
  "Order failed"

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