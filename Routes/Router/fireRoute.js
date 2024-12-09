const express = require("express");
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware')
const FireQuestion = require("../../Controller/FireQuestion/fireController");

// router.post("/create", verifyToken,FireQuestion.Create);
// router.get('/calculate/:fireId', verifyToken,FireQuestion.Calculate);

router.post("/create", FireQuestion.Create);
router.get('/calculate/:fireId', FireQuestion.Calculate);
module.exports = router;