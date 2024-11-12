const express = require('express');
const router = express.Router();
const Insurance = require('../../Controller/Insurance/insuranceController');

router.post('/create',Insurance.createInsurance);
router.put("/update/:id", Insurance.updateInsurance);
router.get("/getbyid/:id", Insurance.getInsuranceById);
router.get("/getall", Insurance.getAllInsurances);
router.delete("/delete/:id", Insurance.deleteInsurance);
module.exports = router;