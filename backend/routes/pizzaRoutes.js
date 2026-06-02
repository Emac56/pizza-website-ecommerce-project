const express = require("express");

const router = express.Router();

const db = require("../config/db");

router.get("/", (req, res) => {

  const sql = "SELECT * FROM pizzas";

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch pizzas"
      });

    }

    res.json(result);

  });

});

module.exports = router;
