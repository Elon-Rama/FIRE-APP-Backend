const allocationDao = require("../../Dao/ExpensesAllocation/allocationDao");
const ExpensesMaster = require("../../Models/Category/masterModel");
const moment = require("moment-timezone");

exports.upsertAllocation = async (userId, titles, month, year) => {
  const user = await allocationDao.findUserById(userId);
  if (!user) {
    return {
      statuscode: "1",
      message: "User not found",
    };
  }

  const existingAllocation = await allocationDao.findExpensesAllocation(
    userId,
    month,
    year
  );
  let updatedTitles = titles || [];

  if (!updatedTitles.length) {
    updatedTitles = await ExpensesMaster.find({ userId })
      .filter((expense) => expense.active)
      .map((expense) => ({
        title: expense.title,
        amount: 0,
        active: expense.active,
        category: expense.category,
      }));

    if (updatedTitles.length === 0) {
      return {
        statuscode: "1",
        message: "No active expenses found for this user",
      };
    }
  }

  const finalTitles = await processTitles(updatedTitles, existingAllocation);

  const totalExpenses = finalTitles.reduce(
    (total, title) =>
      total + (typeof title.amount === "number" ? title.amount : 0),
    0
  );

  const updateData = {
    userId,
    month,
    year,
    titles: finalTitles,
    totalExpenses,
    active: true,
  };

  const updatedAllocation = await allocationDao.upsertExpensesAllocation(
    userId,
    month,
    year,
    updateData
  );

  return {
    statuscode: "0",
    message: existingAllocation
      ? "Expenses Allocation updated successfully"
      : "Expenses Allocation created successfully",
    userId,
    expensesAllocationId: updatedAllocation._id,
    totalExpenses,
    Expenses: finalTitles.map((title) => ({
      title: title.title,
      amount: title.amount,
      active: title.active,
      category: title.category.map((cat) => ({
        title: cat.title,
        amounts: cat.amounts || [],
        _id: cat._id,
      })),
      _id: title._id,
    })),
  };
};

async function processTitles(updatedTitles, existingAllocation) {
  const existingTitlesMap = existingAllocation
    ? new Map(existingAllocation.titles.map((title) => [title.title, title]))
    : new Map();

  updatedTitles.forEach((title) => {
    const existingTitle = existingTitlesMap.get(title.title);
    if (existingTitle) {
      existingTitle.amount = title.amount || 0;
    } else {
      existingTitlesMap.set(title.title, {
        title: title.title,
        amount: title.amount || 0,
        category: title.category || [],
        active: true,
      });
    }
  });

  return Array.from(existingTitlesMap.values());
}

exports.copyPreviousMonthData = async (userId, month, year) => {
  const user = await allocationDao.findUserById(userId);
  if (!user) {
    return { statusCode: 404, message: "User not found" };
  }

  const previousAllocation = await allocationDao.getPreviousMonthAllocation(
    userId,
    month,
    year
  );
  if (!previousAllocation) {
    return {
      statusCode: 404,
      message: "No allocation data found for the previous month",
    };
  }

  const newAllocationData = {
    userId,
    month,
    year,
    titles: previousAllocation.titles.map((title) => ({
      title: title.title,
      category: title.category,
      amount: title.amount,
      active: title.active,
    })),
    totalExpenses: previousAllocation.totalExpenses,
    active: true,
  };

  const newAllocation = await allocationDao.createOrUpdateAllocation(
    userId,
    month,
    year,
    newAllocationData
  );

  return {
    statusCode: 201,
    message: "Data copied successfully from the previous month",
    userId,
    expensesAllocationId: newAllocation._id,
    totalExpenses: newAllocation.totalExpenses,
    Expenses: newAllocation.titles,
  };
};

exports.updateExpenseAmount = async (userId, entryId, amount) => {
  const expenses = await allocationDao.getExpensesAllocation(userId);
  if (!expenses) {
    return { statusCode: 404, message: "Expenses record not found" };
  }

  const updatedEntry = await allocationDao.updateExpenseAmount(
    expenses,
    entryId,
    amount
  );
  if (!updatedEntry) {
    return { statusCode: 404, message: "Amount entry not found" };
  }

  return {
    statusCode: 200,
    message: "Expense amount updated successfully",
    updatedEntry,
  };
};

exports.updateSubCategoryValues = async (
  userId,
  month,
  year,
  selectedMaster,
  selectedCategory,
  amount
) => {
  const timeZone = "Asia/Kolkata";
  const currentDate = moment().tz(timeZone).format("YYYY-MM-DD");
  const currentTime = moment().tz(timeZone).format("HH:mm:ss");

  try {
    const expenses = await allocationDao.findExpensesAllocation(
      userId,
      month,
      year
    );
    if (!expenses) {
      return {
        statusCode: "1",
        message: "Expenses record not found for the specified month and year",
      };
    }

    const master = expenses.titles.find(
      (title) => title.title === selectedMaster
    );
    if (!master) {
      await allocationDao.addNewMaster(
        expenses,
        selectedMaster,
        selectedCategory,
        amount,
        currentDate,
        currentTime
      );
    } else {
      await allocationDao.updateExistingMaster(
        master,
        selectedCategory,
        amount,
        currentDate,
        currentTime
      );
    }

    return {
      statusCode: "0",
      message: "Subcategory amount updated successfully",
      category: master.category,
      categoryTotal: master.category.reduce(
        (sum, cat) =>
          sum + cat.amounts.reduce((sumAmt, entry) => sumAmt + entry.amount, 0),
        0
      ),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: "1", message: "Internal Server Error" };
  }
};

exports.getAllAllocations = async (userId, month, year) => {
  try {
    let allocation = await allocationDao.findExpensesAllocation(
      userId,
      month,
      year
    );
    if (!allocation) {
      allocation = await allocationDao.copyPreviousMonthAllocation(userId);
      if (!allocation)
        return {
          statusCode: "1",
          message: "No allocation data found for the user",
        };
    }

    const { AllocationTotal, categoryTotal } =
      await allocationDao.calculateAllocationTotal(allocation);
    return {
      statusCode: "0",
      message: "Data fetched successfully",
      data: [allocation, { AllocationTotal, categoryTotal }],
    };
  } catch (err) {
    console.error(err);
    return { statusCode: "1", message: "Internal Server Error" };
  }
};

exports.getAllocationById = async (userId, month, year) => {
  try {
    const allocation = await allocationDao.findExpensesAllocation(
      userId,
      month,
      year
    );
    if (!allocation)
      return { statusCode: "1", message: "Expenses Allocation not found" };

    return {
      statusCode: "0",
      message: "Expenses Allocation fetched successfully",
      data: allocation,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: "1", message: "Internal Server Error" };
  }
};

exports.deleteAllocation = async (allocationId) => {
  try {
    const result = await allocationDao.deleteExpensesAllocation(allocationId);
    if (!result)
      return { statusCode: "1", message: "Expenses Allocation not found" };

    return {
      statusCode: "0",
      message: "Expenses Allocation deleted successfully",
    };
  } catch (err) {
    console.error(err);
    return { statusCode: "1", message: "Internal Server Error" };
  }
};
