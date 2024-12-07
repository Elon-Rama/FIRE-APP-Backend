const allocationDao = require("../../Dao/ExpensesAllocation/allocationDao");
const ExpensesMaster = require("../../Models/Category/masterModel");
const moment = require("moment-timezone");

exports.upsert = async (userId, titles, month, year) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Check if the user exists
      const user = await allocationDao.findUserById(userId);
      if (!user) {
        return resolve({
          statuscode: "1",
          message: "User not found",
        });
      }

      // Step 2: Check for an existing allocation
      const existingAllocation = await allocationDao.findExpensesAllocation(
        userId,
        month,
        year
      );

      // Step 3: Prepare updatedTitles
      let updatedTitles = titles || [];
      if (!updatedTitles.length) {
        // Fetch active expenses for the user
        const activeExpenses = await ExpensesMaster.find({ userId });
        updatedTitles = activeExpenses
          .filter((expense) => expense.active)
          .map((expense) => ({
            title: expense.title,
            amount: 0,
            active: expense.active,
            category: expense.category,
          }));

        if (!updatedTitles.length) {
          return resolve({
            statuscode: "1",
            message: "No active expenses found for this user",
          });
        }
      }

      // Step 4: Process titles
      const finalTitles = await processTitles(
        updatedTitles,
        existingAllocation
      );

      // Step 5: Calculate total expenses
      const totalExpenses = finalTitles.reduce(
        (total, title) =>
          total + (typeof title.amount === "number" ? title.amount : 0),
        0
      );

      // Step 6: Create or update allocation data
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

      // Step 7: Construct and return the response
      resolve({
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
      });
    } catch (error) {
      // Reject with error details
      reject({
        statuscode: "1",
        message: "An error occurred while upserting expenses allocation",
        error: error.message || error,
      });
    }
  });
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

exports.copyPreviousMonthData = (userId, month, year) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await allocationDao.findUserById(userId);
      if (!user) {
        return resolve({ statusCode: 404, message: "User not found" });
      }

      const previousAllocation = await allocationDao.getPreviousMonthAllocation(
        userId,
        month,
        year
      );
      if (!previousAllocation) {
        return resolve({
          statusCode: 404,
          message: "No allocation data found for the previous month",
        });
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

      resolve({
        statusCode: 201,
        message: "Data copied successfully from the previous month",
        userId,
        expensesAllocationId: newAllocation._id,
        totalExpenses: newAllocation.totalExpenses,
        Expenses: newAllocation.titles,
      });
    } catch (error) {
      reject({
        statusCode: 500,
        message: "An error occurred while copying data",
        error: error.message,
      });
    }
  });
};

exports.updateExpenseAmount = (userId, entryId, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const expenses = await allocationDao.getExpensesAllocation(userId);
      if (!expenses) {
        return resolve({
          statusCode: 404,
          message: "Expenses record not found",
        });
      }

      const updatedEntry = await allocationDao.updateExpenseAmount(
        expenses,
        entryId,
        amount
      );
      if (!updatedEntry) {
        return resolve({ statusCode: 404, message: "Amount entry not found" });
      }

      resolve({
        statusCode: 200,
        message: "Expense amount updated successfully",
        updatedEntry,
      });
    } catch (error) {
      reject({
        statusCode: 500,
        message: "An error occurred while updating expense amount",
        error: error.message,
      });
    }
  });
};

exports.updateSubCategoryValues = (
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

  return new Promise(async (resolve, reject) => {
    try {
      const expenses = await allocationDao.findExpensesAllocation(
        userId,
        month,
        year
      );
      if (!expenses) {
        return resolve({
          statusCode: "1",
          message: "Expenses record not found for the specified month and year",
        });
      }

      let master = expenses.titles.find(
        (title) => title.title === selectedMaster
      );

      if (!master) {
        master = await allocationDao.addNewMaster(
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

      const categoryTotal = master.category.reduce(
        (sum, cat) =>
          sum + cat.amounts.reduce((sumAmt, entry) => sumAmt + entry.amount, 0),
        0
      );

      resolve({
        statusCode: "0",
        message: "Subcategory amount updated successfully",
        category: master.category,
        categoryTotal,
      });
    } catch (err) {
      console.error(err);
      reject({
        statusCode: "1",
        message: "Internal Server Error",
        error: err.message,
      });
    }
  });
};

exports.getAllAllocations = (userId, month, year) => {
  return new Promise(async (resolve, reject) => {
    try {
      let allocation = await allocationDao.findExpensesAllocation(
        userId,
        month,
        year
      );
      if (!allocation) {
        allocation = await allocationDao.copyPreviousMonthAllocation(userId);
        if (!allocation) {
          return resolve({
            statusCode: "1",
            message: "No allocation data found for the user",
          });
        }
      }

      const { AllocationTotal, categoryTotal } =
        await allocationDao.calculateAllocationTotal(allocation);

      resolve({
        statusCode: "0",
        message: "Data fetched successfully",
        data: [allocation, { AllocationTotal, categoryTotal }],
      });
    } catch (err) {
      console.error(err);
      reject({
        statusCode: "1",
        message: "Internal Server Error",
        error: err.message,
      });
    }
  });
};

exports.getAllocationById = (userId, month, year) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allocation = await allocationDao.findExpensesAllocation(
        userId,
        month,
        year
      );

      if (!allocation) {
        return resolve({
          statusCode: "1",
          message: "Expenses Allocation not found",
        });
      }

      resolve({
        statusCode: "0",
        message: "Expenses Allocation fetched successfully",
        data: allocation,
      });
    } catch (err) {
      console.error(err);
      reject({
        statusCode: "1",
        message: "Internal Server Error",
        error: err.message,
      });
    }
  });
};

exports.deleteAllocation = (allocationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await allocationDao.deleteExpensesAllocation(allocationId);
      if (!result) {
        return resolve({
          statusCode: "1",
          message: "Expenses Allocation not found",
        });
      }

      resolve({
        statusCode: "0",
        message: "Expenses Allocation deleted successfully",
      });
    } catch (err) {
      console.error(err);
      reject({
        statusCode: "1",
        message: "Internal Server Error",
        error: err.message,
      });
    }
  });
};
