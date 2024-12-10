const ExpensesMaster = require("../../Models/Category/masterModel");
const ChildExpenses = require("../../Models/Category/childModel");
const User = require("../../Models/Login/emailModel");
const ExpensesAllocation = require("../../Models/ExpensesAllocation/allocationModel");

exports.findUserById = async (userId) => {
  return await User.findById(userId).exec();
};

exports.findExpenseById = async (masterId) => {
  return await ExpensesMaster.findById(masterId);
};

exports.findExpenseByTitle = async (userId, title) => {
  return await ExpensesMaster.findOne({ userId, title }).exec();
};

exports.getMasterFundByUserId = async (userId) => {
  return await ExpensesMaster.find({ userId });
};

exports.createExpense = async (data) => {
  const titleData = new ExpensesMaster(data);
  return await titleData.save();
};

exports.updateExpenseById = async (masterId, updateData) => {
  return await ExpensesMaster.findByIdAndUpdate(masterId, updateData, 
    { $set: updatedFund },
    { new: true, upsert: true }
  );
};


exports.updateExpenseAllocationTitles = (userId, titleData) => {
  return ExpensesAllocation.findOneAndUpdate(
    { userId },
    { $push: { titles: titleData } },
    { new: true, upsert: true }
  ).exec();
};

exports.updateChildExpensesStatus = (masterId, status) => {
  return ChildExpenses.updateMany(
    { masterId: masterId },
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
