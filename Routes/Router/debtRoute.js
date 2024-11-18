const express = require('express');
const router = express.Router();

const Debt = require('../../Controller/Debt-Clearance/debtController');

router.post('/create',Debt.createDebt);
router.get('/getAll',Debt.getAllDebts);

module.exports = router;