
const Income = require("../../Models/RealityExpenses/budgetIncomeModel");

exports.findIncomeByUserMonthYear = async (userId, month, year) => {
  return await Income.findOne({ userId, month, year });
};

exports.createIncome = async (incomeData) => {
  const income = new Income(incomeData);
  return await income.save();
};

exports.findIncomeById = async (id) => {
  return await Income.findById(id);
};

exports.updateIncomeById = async (id, updatedData) => {
  return await Income.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
};

exports.deleteIncomeById = async (id) => {
  return await Income.findByIdAndDelete(id);
};

exports.findIncomesByUserMonthYear = async (userId, month, year) => {
  return await Income.find({ userId, month, year });
};
