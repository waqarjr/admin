const express = require("express");
const { signupControl } = require("../controllers/signupControl");
const router = express.Router();

router.post("/signup", signupControl);

module.exports = router;
