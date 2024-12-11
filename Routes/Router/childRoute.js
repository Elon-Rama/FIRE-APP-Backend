const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const ChildExpenses = require("../../Controller/Category/childController");

router.post("/create", verifyToken, ChildExpenses.upsert);
router.get("/all", verifyToken, ChildExpenses.getAll);
router.post("/getByMasterName", verifyToken, ChildExpenses.getChildByMaster);
router.delete("/delete/:id", verifyToken, ChildExpenses.delete);
router.get("/search", verifyToken, ChildExpenses.search);

// router.post("/create", ChildExpenses.upsert);
// router.get("/all", ChildExpenses.getAll);
// router.post("/getByMasterName", ChildExpenses.getChildByMaster);
// router.delete("/delete/:id", ChildExpenses.delete);
// router.get("/search",  ChildExpenses.search);

module.exports = router;
