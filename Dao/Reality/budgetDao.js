const RealityIncome = require("../../Models/Reality/budgetIncome");

exports.createBudget = async (budgetData) => {
  const newBudget = new RealityIncome(budgetData);
  return await newBudget.save();
};

exports.getBudgetById = async (budgetId) => {
  return await RealityIncome.findById(budgetId);
};

exports.deleteBudget = async (budgetId) => {
  return await RealityIncome.findByIdAndDelete(budgetId);
};

exports.getBudgetByMonthAndYear = async (userId, month, year) => {
  return await RealityIncome.findOne({ userId, month, year });
};

exports.updateBudget = async (id, budgetData) => {
  return await RealityIncome.findByIdAndUpdate(id, budgetData, { new: true });
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
    const futureBudget = await RealityIncome.findOne({
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
