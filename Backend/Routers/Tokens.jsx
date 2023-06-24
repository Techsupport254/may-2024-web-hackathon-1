const express = require("express");
const router = express.Router();

const { createToken } = require("../Controller/Tokens.jsx");

router.get("/", createToken);

module.exports = router;
