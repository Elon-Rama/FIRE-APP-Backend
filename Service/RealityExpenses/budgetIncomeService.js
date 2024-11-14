// services/incomeService.js
const incomeDao = require("../../Dao/RealityExpenses/budgetIncomeDao");
const User = require("../../Models/Login/emailModel");

exports.createIncome = async ({ userId, month, year, date, income, otherIncome }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const existingIncome = await incomeDao.findIncomeByUserMonthYear(userId, month, year);
  if (existingIncome) throw new Error("Income for this month and year already exists");

  const validOtherIncome = otherIncome.map((item) => parseFloat(item) || 0);
  const totalOtherIncome = validOtherIncome.reduce((acc, value) => acc + value, 0);
  const totalIncomeValue = parseFloat(income.replace(/,/g, "")) + totalOtherIncome;

  return await incomeDao.createIncome({
    userId,
    month,
    year,
    date,
    income,
    otherIncome: validOtherIncome,
    totalIncome: totalIncomeValue.toString(),
  });
};

exports.getIncomeById = async (id) => {
  const income = await incomeDao.findIncomeById(id);
  if (!income) throw new Error("Income not found");
  return income;
};

exports.updateIncome = async (id, updateData) => {
  const { income, otherIncome } = updateData;
  const validOtherIncome = otherIncome.map((item) => parseFloat(item) || 0);
  const totalOtherIncome = validOtherIncome.reduce((acc, value) => acc + value, 0);
  const totalIncomeValue = parseFloat(income.replace(/,/g, "")) + totalOtherIncome;

  return await incomeDao.updateIncomeById(id, {
    ...updateData,
    otherIncome: validOtherIncome,
    totalIncome: totalIncomeValue.toString(),
  });
};

exports.deleteIncome = async (id) => {
  const deletedIncome = await incomeDao.deleteIncomeById(id);
  if (!deletedIncome) throw new Error("Income not found");
  return deletedIncome;
};

exports.viewIncome = async (userId, month, year) => {
  const incomes = await incomeDao.findIncomesByUserMonthYear(userId, month, year);
  if (!incomes.length) throw new Error("No income found for this user in the specified month and year");
  return incomes;
};
