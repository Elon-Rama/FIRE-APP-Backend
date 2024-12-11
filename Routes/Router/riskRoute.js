const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware');
const Risk = require("../../Controller/PersonalRiskTolerance/riskController");

router.post('/create',verifyToken,Risk.saveRiskProfile);
router.get('/getscore',verifyToken,Risk.getRiskProfile);

// router.post('/create',Risk.saveRiskProfile);
// router.get('/getscore',Risk.getRiskProfile);

module.exports = router;
