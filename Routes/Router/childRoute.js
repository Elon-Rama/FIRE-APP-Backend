const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const ChildExpenses = require("../../Controller/Category/childController");

router.post("/create", verifyToken, ChildExpenses.upsert);
router.get("/all", verifyToken, ChildExpenses.getAll);
router.post("/getByMasterName", verifyToken, ChildExpenses.getChildByMaster);
router.delete("/delete/:id", verifyToken, ChildExpenses.delete);
router.get("/search", verifyToken, ChildExpenses.search);

module.exports = router;
