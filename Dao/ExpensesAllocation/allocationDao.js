const User = require("../../Models/Login/emailModel");
const ExpensesAllocation = require("../../Models/ExpensesAllocation/allocationModel");
const moment = require("moment-timezone");

exports.findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error("Error fetching user by ID: " + error.message);
  }
};

exports.findExpensesAllocation = async (userId, month, year) => {
  try {
    const allocation = await ExpensesAllocation.findOne({
      userId,
      month,
      year,
    });
    return allocation;
  } catch (error) {
    throw new Error("Error fetching expenses allocation: " + error.message);
  }
};

exports.upsertExpensesAllocation = async (userId, month, year, updateData) => {
  try {
    const updatedAllocation = await ExpensesAllocation.findOneAndUpdate(
      { userId, month, year },
      { $set: updateData },
      { new: true, upsert: true }
    );
    return updatedAllocation;
  } catch (error) {
    throw new Error(
      "Error updating or creating expenses allocation: " + error.message
    );
  }
};

exports.findUserById = async (userId) => {
  return await User.findById(userId);
};

exports.getPreviousMonthAllocation = async (userId, month, year) => {
  const monthNames = [
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
  const monthIndex = monthNames.indexOf(month);
  if (monthIndex === -1 || monthIndex === 0) return null;

  const previousMonth = monthNames[monthIndex - 1];
  const previousYear = monthIndex === 0 ? year - 1 : year;

  return await ExpensesAllocation.findOne({
    userId,
    month: previousMonth,
    year: previousYear,
  });
};

exports.createOrUpdateAllocation = async (
  userId,
  month,
  year,
  allocationData
) => {
  return await ExpensesAllocation.findOneAndUpdate(
    { userId, month, year },
    { $set: allocationData },
    { new: true, upsert: true }
  );
};

exports.getExpensesAllocation = async (userId) => {
  return await ExpensesAllocation.findOne({ userId });
};

exports.updateExpenseAmount = async (expenses, entryId, amount) => {
  let foundEntry = null;
  for (const title of expenses.titles) {
    for (const category of title.category) {
      foundEntry = category.amounts.find(
        (entry) => entry._id.toString() === entryId
      );
      if (foundEntry) break;
    }
    if (foundEntry) break;
  }

  if (foundEntry) {
    foundEntry.amount = parseFloat(amount);
    foundEntry.Date = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
    foundEntry.time = moment().tz("Asia/Kolkata").format("HH:mm:ss");
    await expenses.save();
    return foundEntry;
  }

  return null;
};

exports.findExpensesAllocation = async (userId, month, year) => {
    return await ExpensesAllocation.findOne({ userId, month, year });
  };
  
  exports.addNewMaster = async (expenses, selectedMaster, selectedCategory, amount, currentDate, currentTime) => {
    const newMaster = {
      title: selectedMaster,
      active: true,
      category: [{
        title: selectedCategory,
        amounts: [{
          amount: parseFloat(amount),
          Date: currentDate,
          time: currentTime,
        }],
      }],
    };
    expenses.titles.push(newMaster);
    await expenses.save();
  };
  
  exports.updateExistingMaster = async (master, selectedCategory, amount, currentDate, currentTime) => {
    const category = master.category.find((cat) => cat.title === selectedCategory);
    if (category) {
      category.amounts.push({
        amount: parseFloat(amount),
        Date: currentDate,
        time: currentTime,
      });
    } else {
      master.category.push({
        title: selectedCategory,
        amounts: [{
          amount: parseFloat(amount),
          Date: currentDate,
          time: currentTime,
        }],
      });
    }
    await master.save();
  };
  
  exports.copyPreviousMonthAllocation = async (userId) => {
    const previousAllocation = await ExpensesAllocation.findOne({ userId });
    if (previousAllocation) {
      const modifiedTitles = previousAllocation.titles.map((title) => ({
        title: title.title,
        active: title.active,
        category: title.category,
        amount: 0,
      }));
  
      const newAllocation = new ExpensesAllocation({
        userId,
        month: 'newMonth', // You'll need to calculate this
        year: 'newYear',   // and calculate the year too
        titles: modifiedTitles,
        AllocationTotal: 0,
        RealityTotal: 0,
      });
  
      await newAllocation.save();
      return newAllocation;
    }
    return null;
  };
  
  exports.calculateAllocationTotal = async (allocation) => {
    let AllocationTotal = 0;
    let categoryTotal = 0;
  
    allocation.titles.forEach((title) => {
      const titleAmount = title.amount;
      title.category.forEach((cat) => {
        const categoryTotalAmount = cat.amounts.reduce((sum, amt) => sum + amt.amount, 0);
        cat.totalAmount = categoryTotalAmount;
        categoryTotal += categoryTotalAmount;
      });
      AllocationTotal += titleAmount;
    });
  
    return { AllocationTotal, categoryTotal };
  };
  
  exports.deleteExpensesAllocation = async (allocationId) => {
    return await ExpensesAllocation.findByIdAndDelete(allocationId);
  };