const realityDao = require("../../Dao/Reality/expensesDao");
const UserDAO = require("../../Dao/Login/emailDao");

exports.createExpense = (updateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId, month, year, title, categories } = updateData;
      const user = await UserDAO.findUserById(userId);
      if (!user) {
        return reject({ error: "User not found" });
      }

      const totalAmount = categories.reduce(
        (acc, category) => acc + category.amount,
        0
      );

      const newExpense = {
        userId: user._id,
        month,
        year,
        title,
        categories,
        totalAmount,
      };
      const createdExpenses = await realityDao.createExpense(newExpense);

      resolve({
        statusCode: "0",
        message: "Expense created successfully",
        userId,
        data: createdExpenses,
      });
    } catch (error) {
      reject({
        statusCode: "1",
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.getAllExpenses = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const expenses = await realityDao.getExpensesByUserId(userId);

      if (!expenses || expenses.length === 0) {
        return reject({
          statusCode: "1",
          message: "No expenses found for the provided userId",
        });
      }

      return resolve({
        statusCode: "0",
        message: "Expenses retrieved successfully",
        data: expenses,
      });
    } catch (error) {
      return reject({
        statusCode: "1",
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.getExpenseById = (expensesId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const expenses = await realityDao.getExpensesById(expensesId);
      if (!expenses) {
        return reject(new Error("expensesId not found"));
      }

      resolve(expenses);
    } catch (error) {
      reject(new Error("Failed to retrieve budget: " + error.message));
    }
  });
};

exports.deleteExpense = (expensesId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedExpenses = await realityDao.deleteBudget(expensesId);
      if (!deletedExpenses) {
        return reject(new Error("expenses not found"));
      }

      resolve({ message: "expenses deleted successfully" });
    } catch (error) {
      reject(new Error("Failed to delete budget: " + error.message));
    }
  });
};

exports.updateExpense = (expensesId, updateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Retrieve the existing expenses by ID
      const existingExpenses = await realityDao.getExpensesById(expensesId);
      if (!existingExpenses) {
        return reject(new Error("ExpensesId not found"));
      }

      // Calculate the total amount from categories
      const totalAmount = updateData.categories.reduce(
        (acc, category) => acc + category.amount,
        0
      );

      // Prepare the updated expense data
      const updatedExpenseData = {
        expensesId,       // Expense ID
        ...updateData,     // Spread the existing data (title, categories, etc.)
        totalAmount,       // Add the calculated total amount
      };

      // Ensure the function signature is correct for updateExpenses
      const updatedExpense = await realityDao.updateExpenses(
        expensesId,        // Pass the expensesId (if required)
        updatedExpenseData // Pass the updated expense data
      );

      if (!updatedExpense) {
        return reject(new Error("Expense not found"));
      }

      resolve(updatedExpense);  // Successfully updated
    } catch (error) {
      reject(new Error("Failed to update expense: " + error.message));
    }
  });
};
