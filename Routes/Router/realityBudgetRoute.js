const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const RealityIncome = require("../../Controller/Reality/budgetController");

router.post("/create", verifyToken, RealityIncome.createIncome);
router.get("/getbyid/:budgetId", verifyToken, RealityIncome.getIncomeById);
router.put("/update/:budgetId", verifyToken, RealityIncome.updateIncome);
router.delete("/delete/:budgetId", verifyToken, RealityIncome.deleteIncome);
router.get("/view", verifyToken, RealityIncome.viewIncome);

module.exports = router;
