const express = require("express");
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware')
const FireQuestion = require("../../Controller/FireQuestion/fireController");

router.post("/create", verifyToken,FireQuestion.create);
router.get('/calculate/:fireId', verifyToken, FireQuestion.calculate);

// router.post("/create", FireQuestion.create);
// router.get('/calculate/:fireId',  FireQuestion.calculate);

module.exports = router;