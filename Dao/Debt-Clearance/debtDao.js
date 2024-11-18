const Debt = require('../../Models/Debt-Clearance/debtModel');

exports.findDebtByUserId = (userId) => {
  return Debt.findOne({ userId });
};

exports.saveDebt = (debtData) => {
  const debt = new Debt(debtData);
  return debt.save();
};

exports.updateDebt = (debtData) => {
  return Debt.findByIdAndUpdate(debtData._id, debtData, { new: true });
};


