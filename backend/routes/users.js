const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/userController.js");

router.post("/signup", userCtrl.handleRegister);
router.post("/login", userCtrl.handleAuth);

module.exports = router;
