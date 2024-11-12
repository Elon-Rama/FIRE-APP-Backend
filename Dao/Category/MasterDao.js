const ExpensesMaster = require("../../Models/Category/masterModel");
const ChildExpenses = require("../../Models/Category/childModel");
const User = require("../../Models/Login/emailModel");
const ExpensesAllocation = require("../../Models/ExpensesAllocation/allocationModel");

exports.findUserById = (userId) => {
  return User.findById(userId).exec();
};

exports.findExpenseById = (expenseId) => {
  return ExpensesMaster.findById(expenseId).exec();
};

exports.findExpenseByTitle = (userId, title) => {
  return ExpensesMaster.findOne({ userId, title }).exec();
};

exports.createExpense = (data) => {
  const newExpense = new ExpensesMaster(data);
  return newExpense.save();
};

exports.updateExpenseById = (id, updateData) => {
  return ExpensesMaster.findByIdAndUpdate(id, updateData, {
    new: true,
    upsert: true,
  }).exec();
};

exports.updateExpenseAllocationTitles = (userId, titleData) => {
  return ExpensesAllocation.findOneAndUpdate(
    { userId },
    { $push: { titles: titleData } },
    { new: true, upsert: true }
  ).exec();
};

exports.updateChildExpensesStatus = (expenseId, status) => {
  return ChildExpenses.updateMany(
    { expensesId: expenseId },
    { active: status }
  ).exec();
};

exports.updateAllocationTitlesStatus = (title, status) => {
  return ExpensesAllocation.updateMany(
    { "titles.title": title },
    { $set: { "titles.$.active": status } }
  ).exec();
};

exports.findAllocationsByTitle = (title) => {
  return ExpensesAllocation.find({ "titles.title": title }).exec();
};
