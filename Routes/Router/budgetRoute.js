const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const Budget = require("../../Controller/ExpensesAllocation/budgetController");

router.post("/create", verifyToken, Budget.Create);
router.get("/getById/:id", verifyToken, Budget.getById);
// router.get('/view', verifyToken,Budget.View);
router.put("/update/:id", verifyToken, Budget.update);
// router.delete('/delete/:id', verifyToken,Budget.Delete);
router.get("/calculate", verifyToken, Budget.calculateBudget);

module.exports = router;
