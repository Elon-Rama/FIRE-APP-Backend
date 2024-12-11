const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const RealityExpense = require("../../Controller/Reality/expensesController");

router.post("/expenses",verifyToken,RealityExpense.createExpense);
router.get("/getAllExpenses", verifyToken,RealityExpense.getAllExpenses);
router.get("/getExpense/:expensesId",verifyToken, RealityExpense.getExpenseById);
router.put("/updateExpense/:expensesId", verifyToken,RealityExpense.updateExpense);
router.delete("/deleteExpense/:expensesId", verifyToken, RealityExpense.deleteExpense);

module.exports = router;
