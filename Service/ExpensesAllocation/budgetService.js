const budgetDao = require("../../Dao/ExpensesAllocation/budgetDao");
const User = require("../../Models/Login/emailModel");
const ExpensesAllocation = require("../../Models/ExpensesAllocation/allocationModel");

exports.createBudget = async (budgetData) => {
  const { month, year, userId } = budgetData;

  const user = await User.getUserById(userId);
  if (!user) throw new Error("User not found");

  const existingBudget = await budgetDao.getBudgetByMonthAndYear(
    userId,
    month,
    year
  );
  if (existingBudget) {
    throw new Error("Budget entry already exists for this month and year");
  }

  // Calculate total income
  const otherIncomeValues = budgetData.otherIncome
    .slice(0, 10)
    .concat(Array(10 - budgetData.otherIncome.length).fill(""));
  const totalOtherIncome = otherIncomeValues.reduce(
    (acc, curr) => acc + Number(curr),
    0
  );
  const totalIncome = Number(budgetData.income) + totalOtherIncome;

  const newBudget = {
    ...budgetData,
    otherIncome: otherIncomeValues,
    totalIncome,
  };

  const createdBudget = await budgetDao.createBudget(newBudget);
  await budgetDao.propagateFutureMonths(createdBudget);

  return createdBudget;
};

exports.updateBudget = async (id, budgetData) => {
  const existingBudget = await budgetDao.getBudgetById(id);
  if (!existingBudget) throw new Error("Budget not found");

  const updatedBudget = await budgetDao.updateBudget(id, budgetData);
  if (budgetData.propagate) {
    await budgetDao.propagateFutureMonths(updatedBudget);
  }

  return updatedBudget;
};

exports.getBudgetById = async (id) => {
  const budget = await budgetDao.getBudgetById(id);
  if (!budget) throw new Error("Budget not found");
  return budget;
};

exports.calculateBudget = async (month, year, userId) => {
  const budget = await budgetDao.getBudgetByMonthAndYear(userId, month, year);
  if (!budget)
    throw new Error("No budget found for the selected month and year");

  const expensesAllocation = await expensesAllocationDao.getExpensesAllocation(
    userId,
    month,
    year
  );
  if (!expensesAllocation)
    throw new Error(
      "No expenses allocation found for the selected month and year"
    );

  const totalIncome = budget.totalIncome;
  const totalExpenses = expensesAllocation.totalExpenses;
  const remainingBalance = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, remainingBalance };
};
