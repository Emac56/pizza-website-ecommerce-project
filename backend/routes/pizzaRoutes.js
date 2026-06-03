const express = require("express");

const router = express.Router();

const db = require("../config/db");

router.get("/", async (req, res) => {

try {

const result = await db.query(
  "SELECT * FROM pizzas"
);

res.json(result.rows);

}

catch (err) {

console.log(err);

res.status(500).json({

  message: "Failed to fetch pizzas"

});

}

});

module.exports = router;