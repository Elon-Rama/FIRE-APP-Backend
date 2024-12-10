const express = require("express");
const router = express.Router();
const DebtClearance = require("../../Controller/Debt-Clearance/debtController");
const { verifyToken } = require("../../Middleware/authMiddleware");

router.post("/create", verifyToken, DebtClearance.createDebt);
router.get("/all", verifyToken, DebtClearance.getAllDebts);
router.post("/payemi", verifyToken, DebtClearance.payEMI);

module.exports = router;
