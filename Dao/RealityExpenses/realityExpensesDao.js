const Expense = require("../../Models/RealityExpenses/realityExpensesModel");

exports.createExpense = async (expenseData) => {
  const newExpense = new Expense(expenseData);
  return await newExpense.save();
};

exports.getAllExpenses = async () => {
  return await Expense.find();
};

exports.getExpenseById = async (id) => {
  return await Expense.findById(id);
};

exports.updateExpense = async (id, updateData) => {
  return await Expense.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteExpense = async (id) => {
  return await Expense.findByIdAndDelete(id);
};
