const express = require("express");
const { login , logout } = require("../controllers/AuthControl");
const authMiddleware  = require("../middlewares/authmiddleware");
const router = express.Router();

router.post("/login", login);

router.post("/logout",  logout);

router.post("/checking" , authMiddleware);

module.exports = router;
