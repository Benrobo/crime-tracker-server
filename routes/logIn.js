const express = require("express");
const router = express.Router();

const auth = require("../services/auth");
const util = require("../util");

router.post("/login", async (req, res) => {
  let data = req.body;
});

module.exports = router;