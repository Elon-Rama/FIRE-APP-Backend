const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const Expenses = require("../../Controller/Reality/expensesController");

// router.post("/expenses", verifyToken,Expenses.createExpense);
// router.get("/getAllExpenses", verifyToken, Expenses.getAllExpenses);
// router.get("/getExpense/:id", verifyToken, Expenses.getExpenseById);
// router.put("/updateExpense/:id", verifyToken, Expenses.updateExpense);
// router.delete("/deleteExpense/:id", verifyToken, Expenses.deleteExpense);

router.post("/expenses",Expenses.createExpense);
router.get("/getAllExpenses", Expenses.getAllExpenses);
router.get("/getExpense/:id", Expenses.getExpenseById);
router.put("/updateExpense/:id", Expenses.updateExpense);
router.delete("/deleteExpense/:id",  Expenses.deleteExpense);

module.exports = router;
