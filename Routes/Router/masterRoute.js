const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const ExpensesMaster = require("../../Controller/Category/masterController");

router.post("/create", verifyToken, ExpensesMaster.upsert);
router.get("/all", verifyToken, ExpensesMaster.getAll);
router.get("/getbyid/:expenses_id", verifyToken, ExpensesMaster.getById);
router.delete("/delete/:expenses_id", verifyToken, ExpensesMaster.deleteById);


module.exports = router;
