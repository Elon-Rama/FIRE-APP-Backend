const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const budgetIncome = require("../../Controller/RealityExpenses/budgetIncomeController.js");

router.post("/income", verifyToken, budgetIncome.createIncome);
router.get("/viewIncome", verifyToken, budgetIncome.viewIncome);
router.get("/getIncome/:id", verifyToken, budgetIncome.getIncomeById);
router.put("/updateIncome/:id", verifyToken, budgetIncome.updateIncome);
router.delete("/deleteIncome/:id", verifyToken, budgetIncome.deleteIncome);

module.exports = router;
