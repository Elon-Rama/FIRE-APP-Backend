const MasterDao = require("../../Dao/Category/MasterDao");

exports.upsertExpense = async (userId, title, id) => {
  try {
    const user = await MasterDao.findUserById(userId);
    if (!user) {
      return { statusCode: "1", message: "User not found" };
    }

    const expenseData = { userId, title, active: true };

    if (id) {
      // Update existing expense
      const updatedTitle = await MasterDao.updateExpenseById(id, expenseData);
      return {
        statusCode: "0",
        message: "Categories Title updated successfully",
        data: updatedTitle,
      };
    } else {
      // Check for duplicate title
      const existingTitle = await MasterDao.findExpenseByTitle(userId, title);
      if (existingTitle) {
        return {
          statusCode: "1",
          message:
            "This title already exists. Please try again with a different title.",
        };
      }

      // Create new expense
      const newTitle = await MasterDao.createExpense(expenseData);
      const titleData = {
        title: newTitle.title,
        active: newTitle.active,
        amount: 0,
      };
      await MasterDao.updateExpenseAllocationTitles(userId, titleData);

      return {
        statusCode: "0",
        message: "Categories Title created successfully",
        data: newTitle,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllExpenses = async (userId) => {
  try {
    const expenses = await MasterDao.findExpenseByTitle(userId);
    if (!expenses.length) {
      return {
        statusCode: "1",
        message: "No Expenses found for the provided userId",
      };
    }
    return {
      statusCode: "0",
      message: "Expenses retrieved successfully",
      data: expenses,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getExpenseById = async (expenseId) => {
  try {
    const expense = await MasterDao.findExpenseById(expenseId);
    if (expense) {
      return {
        statusCode: "0",
        message: "Expense data retrieved successfully",
        data: expense,
      };
    }
    return { statusCode: "1", message: "Expense ID not found" };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.toggleExpenseStatus = async (expenseId) => {
  try {
    const expense = await MasterDao.findExpenseById(expenseId);
    if (!expense) {
      return { statusCode: "1", message: "No expense data found" };
    }

    const previousStatus = expense.active;
    expense.active = !previousStatus;
    await expense.save();

    const allocations = await MasterDao.findAllocationsByTitle(expense.title);
    const promises = allocations.map(async (allocation) => {
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

    await Promise.all(promises);

    await Promise.all([
      MasterDao.updateChildExpensesStatus(expenseId, expense.active),
      MasterDao.updateAllocationTitlesStatus(expense.title, expense.active),
    ]);

    const message = expense.active
      ? "Expense activated successfully"
      : "Expense inactivated successfully";
    return { statusCode: "0", message, data: { parent: expense } };
  } catch (error) {
    throw new Error(error.message);
  }
};
