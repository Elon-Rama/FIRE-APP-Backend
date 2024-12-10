const MasterDao = require("../../Dao/Category/MasterDao");

exports.upsertExpense = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId, title, active = true, masterId } = data;

      if (!userId || !title) {
        return resolve({
          statusCode: "1",
          message: "Required fields are missing",
        });
      }

      const user = await MasterDao.findUserById(userId);
      if (!user) {
        return resolve({
          statusCode: "1",
          message: "User not found",
        });
      }

      if (masterId) {
        const updatedTitle = await MasterDao.updateExpenseById(masterId, {
          userId,
          title,
          active,
        });
        return resolve({
          statusCode: "0",
          message: "Expense title updated successfully",
          data: updatedTitle,
        });
      } else {
        const existingTitle = await MasterDao.findExpenseByTitle(userId, title);
        if (existingTitle) {
          return resolve({
            statusCode: "1",
            message:
              "This title already exists. Please try again with a different title.",
          });
        }

        const expenseData = { userId, title, active };

        const newTitle = await MasterDao.createExpense(expenseData);

        const titleData = {
          // userId:newTitle.userId,
          title: newTitle.title,
          active: newTitle.active,
          amount: 0,
        };
        await MasterDao.updateExpenseAllocationTitles(userId, titleData);

        return resolve({
          statusCode: "0",
          message: "Expense title created successfully",
          userId,
          data: titleData,
        });
      }
    } catch (error) {
      console.error("Error in upsertExpense:", error.message);
      return reject({
        statusCode: "1",
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.getAllExpenses = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const expenses = await MasterDao.getMasterFundByUserId(userId);
      if (!expenses.length) {
        return reject({
          statusCode: "1",
          message: "No Expenses found for the provided userId",
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

exports.getExpenseById = async (masterId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const expense = await MasterDao.findExpenseById(masterId);
      if (expense) {
        return resolve({
          statusCode: "0",
          message: "Expense data retrieved successfully",
          data: expense,
        });
      }
      return reject({ statusCode: "1", message: "Expense ID not found" });
    } catch (error) {
      return reject({
        statusCode: "1",
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.deleteById = async (masterId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const expense = await MasterDao.findExpenseById(masterId);
      if (!expense) {
        return reject({ statusCode: "1", message: "No expense data found" });
      }

      const previousStatus = expense.active;
      expense.active = !previousStatus;
      await expense.save();

      const allocations = await MasterDao.findAllocationsByTitle(expense.title);
      const allocationPromises = allocations.map(async (allocation) => {
        const titleEntry = allocation.titles.find(
          (title) => title.title === expense.title
        );
        if (titleEntry) {
          if (previousStatus && !expense.active) {
            allocation.totalExpenses -= titleEntry.amount;
            titleEntry.amount = 0;
            titleEntry.category.forEach((i) => (i.amount = 0));
          }
          allocation.totalExpenses = Math.max(0, allocation.totalExpenses);
        }
        return allocation.save();
      });

      await Promise.all(allocationPromises);

      await Promise.all([
        MasterDao.updateChildExpensesStatus(masterId, expense.active),
        MasterDao.updateAllocationTitlesStatus(expense.title, expense.active),
      ]);

      const message = expense.active
        ? "Expense activated successfully"
        : "Expense inactivated successfully";

      return resolve({
        statusCode: "0",
        message,
        data: { parent: expense },
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
