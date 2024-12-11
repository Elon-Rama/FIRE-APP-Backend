const budgetDao = require("../../Dao/ExpensesAllocation/budgetDao");
const UserDAO = require("../../Dao/Login/emailDao");
const ExpensesAllocation = require("../../Models/ExpensesAllocation/allocationModel");

exports.create = (budgetData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { month, year, userId, income, otherIncome = [] } = budgetData;

      const user = await UserDAO.findUserById(userId);
      if (!user) {
        return reject({ error: "User not found" });
      }

      const existingBudget = await budgetDao.getBudgetByMonthAndYear(
        userId,
        month,
        year
      );
      if (existingBudget) {
        return reject(
          new Error("Budget entry already exists for this month and year")
        );
      }

      const otherIncomeValues = otherIncome
        .slice(0, 10)
        .concat(Array(10 - otherIncome.length).fill(0));
      const totalOtherIncome = otherIncomeValues.reduce(
        (acc, curr) => acc + Number(curr || 0),
        0
      );
      const totalIncome = Number(income || 0) + totalOtherIncome;

      const newBudget = {
        ...budgetData,
        otherIncome: otherIncomeValues,
        totalIncome,
      };

      const createdBudget = await budgetDao.createBudget(newBudget);

      await budgetDao.propagateFutureMonths(createdBudget);

      resolve(createdBudget);
    } catch (error) {
      console.error("Error in budget creation:", error);
      reject(new Error("Failed to create budget: " + error.message));
    }
  });
};

exports.updateBudget = (id, budgetData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingBudget = await budgetDao.getBudgetById(id);
      if (!existingBudget) {
        return reject(new Error("Budget not found"));
      }

      const updatedBudget = await budgetDao.updateBudget(id, budgetData);
      if (budgetData.propagate) {
        await budgetDao.propagateFutureMonths(updatedBudget);
      }

      resolve(updatedBudget);
    } catch (error) {
      reject(new Error("Failed to update budget: " + error.message));
    }
  });
};

exports.deleteBudget = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingBudget = await budgetDao.getBudgetById(id);
      if (!existingBudget) {
        return reject(new Error("Budget not found"));
      }

      await budgetDao.deleteBudget(id);
      resolve({ message: "Budget deleted successfully" });
    } catch (error) {
      reject(new Error("Failed to delete budget: " + error.message));
    }
  });
};

exports.getBudgetById = (budgetId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const budget = await budgetDao.getBudgetById(budgetId);
      if (!budget) {
        return reject(new Error("Budget not found"));
      }

      resolve(budget);
    } catch (error) {
      reject(new Error("Failed to retrieve budget: " + error.message));
    }
  });
};

exports.View = ({ month, year, userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const budget = await budgetDao.getBudgetByMonthAndYear(
        userId,
        month,
        year
      );

      if (!budget) {
        return reject(
          new Error("Budget not found for the specified month, year, and user")
        );
      }

      resolve(budget);
    } catch (error) {
      reject(new Error("Failed to retrieve budget: " + error.message));
    }
  });
};

exports.calculateBudget = (month, year, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const budget = await budgetDao.getBudgetByMonthAndYear(userId, month, year);
      if (!budget) {
        return reject(new Error("No budget found for the selected month and year"));
      }

      const expensesAllocation = await ExpensesAllocation.getExpensesAllocation(userId, month, year);
      if (!expensesAllocation) {
        return reject(new Error("No expenses allocation found for the selected month and year"));
      }

      const totalIncome = budget.totalIncome;
      const totalExpenses = expensesAllocation.totalExpenses;
      const remainingBalance = totalIncome - totalExpenses;

      resolve({ totalIncome, totalExpenses, remainingBalance });
    } catch (error) {
      reject(new Error("Failed to calculate budget: " + error.message));
    }
  });
};
