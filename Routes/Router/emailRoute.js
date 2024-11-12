const express = require("express");
const router = express.Router();
const User = require("../../Controller/Login/emailController");

router.post("/signin", User.signIn);
router.post("/verify-otp", User.verifyOTP);
router.post("/logout", User.logout);
router.post("/validate-token", User.validateToken);
router.post("/check-session", User.checkSession);
router.post("/refresh-token", User.refreshToken);

module.exports = router;
