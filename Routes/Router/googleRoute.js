const express = require('express');
const router = express.Router();
const Google = require('../../Controller/O-Auth/googleController');
const passport = require('../../config/passport/google');

router.get('/login/success',Google.loginSuccess);
router.get('/login/failed',Google.loginFailed);
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/google/callback", passport.authenticate("google", {
  successRedirect: process.env.CLIENT_URL,
  failureRedirect: "/login/failed",
}));
router.get("/logout", Google.logout);

module.exports = router;