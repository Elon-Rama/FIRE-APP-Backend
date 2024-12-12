const Budget = require("../../Models/ExpensesAllocation/budgetModel");

exports.createBudget = async (budgetData) => {
  const newBudget = new Budget(budgetData);
  return await newBudget.save();
};

exports.getBudgetById = async (id) => {
  return await Budget.findById(id);
};

exports.deleteBudget = async(id) => {
  return await Budget.findByIdAndDelete(id);
};

exports.getBudgetByMonthAndYear = async (userId, month, year) => {
  return await Budget.findOne({ userId, month, year });
};

exports.updateBudget = async (id, budgetData) => {
  return await Budget.findByIdAndUpdate(id, budgetData, { new: true });
};

exports.propagateFutureMonths = async (budget) => {
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const startMonthIndex = monthsOfYear.indexOf(budget.month);

  for (let i = startMonthIndex + 1; i < monthsOfYear.length; i++) {
    const futureMonth = monthsOfYear[i];
    const futureBudget = await Budget.findOne({
      month: futureMonth,
      year: budget.year,
      userId: budget.userId,
    });

    if (!futureBudget) {
      await this.createBudget({
        month: futureMonth,
        year: budget.year,
        income: budget.income,
        otherIncome: budget.otherIncome,
        totalIncome: budget.totalIncome,
        userId: budget.userId,
      });
    }
  }
};
