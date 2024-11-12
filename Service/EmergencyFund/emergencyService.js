const emergencyDao = require("../../Dao/EmergencyFund/emergencyDao");
const User = require("../../Models/Login/emailModel");

const getCurrentDateTime = () => {
  const now = new Date();
  return {
    date: now.toISOString().split("T")[0],
    time: now.toTimeString().split(" ")[0],
  };
};

exports.upsertEmergencyFund = async (
  userId,
  monthlyExpenses,
  monthsNeed,
  savingsperMonth,
  initialEntry,
  emergencyId
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const expectedFund = monthlyExpenses * monthsNeed;
  const entries = [];

  if (initialEntry) {
    const { amount, rateofInterest, savingsMode, type } = initialEntry;
    const { date, time } = getCurrentDateTime();

    const entry = {
      date,
      time,
      amount,
      type,
    };

    if (type === "savings") {
      entry.rateofInterest = rateofInterest;
      entry.savingsMode = savingsMode;
    }

    entries.push(entry);
  }

  const initialTotalAmount = entries.reduce((sum, entry) => {
    return entry.type === "savings"
      ? sum + (entry.amount || 0)
      : sum - (entry.amount || 0);
  }, 0);

  const totalAmount = Math.max(0, initialTotalAmount);
  const actualFund = initialEntry ? [{ Entry: entries }] : [];

  if (emergencyId) {
    const updatedFund = await emergencyDao.getEmergencyFundById(emergencyId);
    if (!updatedFund) {
      throw new Error("Emergency Fund not found");
    }

    if (!updatedFund.actualFund || updatedFund.actualFund.length === 0) {
      updatedFund.actualFund = [{ Entry: [] }];
    }

    if (initialEntry) {
      updatedFund.actualFund[0].Entry.push(entries[0]);
    }

    updatedFund.monthlyExpenses = monthlyExpenses;
    updatedFund.monthsNeed = monthsNeed;
    updatedFund.savingsperMonth = savingsperMonth;
    updatedFund.expectedFund = expectedFund;
    updatedFund.totalAmount = updatedFund.actualFund[0].Entry.reduce(
      (sum, entry) => {
        return entry.type === "savings"
          ? sum + (entry.amount || 0)
          : sum - (entry.amount || 0);
      },
      0
    );

    updatedFund.totalAmount = Math.max(0, updatedFund.totalAmount);
    return await emergencyDao.updateEmergencyFund(emergencyId, updatedFund);
  } else {
    const emergencyFundData = {
      userId,
      monthlyExpenses,
      monthsNeed,
      savingsperMonth,
      expectedFund,
      actualFund,
      totalAmount,
    };

    return await emergencyDao.createEmergencyFund(emergencyFundData);
  }
};

exports.getEmergencyFundByUserId = async (userId) => {
  return await emergencyDao.getEmergencyFundByUserId(userId);
};

exports.getEmergencyFundById = async (emergencyId) => {
  return await emergencyDao.getEmergencyFundById(emergencyId);
};

exports.deleteEmergencyFundById = async (emergencyId) => {
  return await emergencyDao.deleteEmergencyFundById(emergencyId);
};
