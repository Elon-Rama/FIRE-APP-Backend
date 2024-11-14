const realityExpensesDao = require("../../Dao/RealityExpenses/realityExpensesDao");
const User = require("../../Models/Login/emailModel");

exports.createExpense = async (userId, month, year, title, categories) => {
  const user = await User.findById(userId);
  if (!user){
    throw new Error("User not found");
  }
    
  const totalAmount = categories.reduce(
    (acc, category) => acc + category.amount, 
    0);

  return await realityExpensesDao.createExpense({
    userId: user._id,
    month,
    year,
    title,
    categories,
    totalAmount
  });
};

exports.getAllExpenses = async () => {
  return await realityExpensesDao.getAllExpenses();
};

exports.getExpenseById = async (id) => {
  return await realityExpensesDao.getExpenseById(id);
};

exports.updateExpense = async (id, title, categories) => {
  const totalAmount = categories.reduce((acc, category) => acc + category.amount, 0);
  return await realityExpensesDao.updateExpense(id, { title, categories, totalAmount });
};

exports.deleteExpense = async (id) => {
  return await realityExpensesDao.deleteExpense(id);
};
