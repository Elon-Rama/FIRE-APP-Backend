const budgetDao = require("../../Dao/Reality/budgetDao");
const UserDAO = require("../../Dao/Login/emailDao");

exports.createIncome = (budgetData) => {
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

exports.updateIncome = (budgetId, budgetData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingBudget = await budgetDao.getBudgetById(budgetId);
      if (!existingBudget) {
        return reject(new Error("Budget not found"));
      }

      const income = Number(budgetData.income || 0);
      const otherIncome = Array.isArray(budgetData.otherIncome)
        ? budgetData.otherIncome.map(Number)
        : [];

      const totalOtherIncome = otherIncome.reduce((acc, curr) => acc + curr, 0);
      const totalIncome = income + totalOtherIncome;

      const updatedBudgetData = {
        ...budgetData,
        totalIncome,
      };

      const updatedBudget = await budgetDao.updateBudget(
        budgetId,
        updatedBudgetData
      );

      if (budgetData.propagate) {
        await budgetDao.propagateFutureMonths(updatedBudget);
      }

      resolve(updatedBudget);
    } catch (error) {
      reject(new Error("Failed to update budget: " + error.message));
    }
  });
};

exports.getIncomeById = (budgetId) => {
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

exports.viewIncome = ({ month, year, userId }) => {
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

exports.deleteIncome = (budgetId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedBudget = await budgetDao.deleteBudget(budgetId);
      if (!deletedBudget) {
        return reject(new Error("Budget not found"));
      }

      resolve({ message: "Budget deleted successfully" });
    } catch (error) {
      reject(new Error("Failed to delete budget: " + error.message));
    }
  });
};
