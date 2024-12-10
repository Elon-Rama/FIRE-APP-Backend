const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const ExpensesMaster = require("../../Controller/Category/masterController");

router.post("/create", verifyToken, ExpensesMaster.upsertExpense);
router.get("/all", verifyToken, ExpensesMaster.getAllExpenses);
router.get("/getbyid/:masterId", verifyToken, ExpensesMaster.getExpenseById);
router.delete("/delete/:masterId", verifyToken, ExpensesMaster.deleteById);

module.exports = router;
