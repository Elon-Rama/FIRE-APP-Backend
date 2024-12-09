const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware');
const Risk = require("../../Controller/PersonalRiskTolerance/riskController");

// router.post('/create',verifyToken,PersonalRisk.saveRiskProfile);
// router.get('/getscore',verifyToken,PersonalRisk.getRiskProfile);

router.post('/create',Risk.saveRiskProfile);
router.get('/getscore',Risk.getRiskProfile);

module.exports = router;
