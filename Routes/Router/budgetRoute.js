const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const Budget = require("../../Controller/ExpensesAllocation/budgetController");

router.post("/create",verifyToken, Budget.create);
router.get("/getById/:budgetId", verifyToken, Budget.getById);
router.get('/view', verifyToken,Budget.view);
router.put("/update/:budgetId", verifyToken, Budget.update);
router.delete('/delete/:budgetId', verifyToken,Budget.delete);
router.get("/calculate", verifyToken, Budget.calculateBudget);

module.exports = router;
