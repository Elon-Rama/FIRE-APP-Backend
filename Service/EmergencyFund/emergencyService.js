const emergencyDao = require("../../Dao/EmergencyFund/emergencyDao");

const getCurrentDateTime = () => {
  const now = new Date();
  return {
    date: now.toISOString().split("T")[0],
    time: now.toTimeString().split(" ")[0],
  };
};

exports.upsert = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        userId,
        monthlyExpenses,
        monthsNeed,
        savingsperMonth,
        initialEntry,
        emergencyId,
      } = data;

      if (!userId || !monthlyExpenses || !monthsNeed) {
        return resolve({
          statusCode: "1",
          message: "Required fields are missing",
        });
      }

      const user = await emergencyDao.findUserById(userId);
      if (!user) {
        return resolve({
          statusCode: "1",
          message: "User not found",
        });
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
        console.log("Checking Emergency Fund with ID:", emergencyId);

        const updatedFund = await emergencyDao.getEmergencyFundById(
          emergencyId
        );
        console.log("Updated Fund Query Result:", updatedFund);

        if (!updatedFund) {
          return resolve({
            statusCode: "1",
            message: "Emergency Fund not found",
          });
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

        const updateEmergency = await emergencyDao.updateEmergencyFund(
          emergencyId,
          updatedFund
        );

        return resolve({
          statusCode: "0",
          message: "Emergency Fund updated successfully",
          data: updateEmergency,
        });
      } else {
        const emergencyFund = {
          userId,
          monthlyExpenses,
          monthsNeed,
          savingsperMonth,
          expectedFund,
          actualFund,
          totalAmount,
        };

        const savedFund = await emergencyDao.createEmergencyFund(emergencyFund);

        return resolve({
          statusCode: "0",
          message: "Emergency Fund created successfully",
          data: savedFund,
        });
      }
    } catch (error) {
      return reject({
        statusCode: "1",
        message: error.message,
      });
    }
  });
};

exports.getAll = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const emergency = await emergencyDao.getEmergencyFundByUserId(userId);

      if (!emergency || emergency.length === 0) {
        return reject({
          statusCode: "1",
          message: "No Expenses found for the provided userId",
        });
      }

      return resolve({
        statusCode: "0",
        message: "Expenses retrieved successfully",
        data: emergency,
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

exports.getById = (emergencyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const emergency = await emergencyDao.getEmergencyFundById(emergencyId);
      if (emergency) {
        return resolve({
          statusCode: "0",
          message: "Emergency Id retrieved successfully",
          data: emergency,
        });
      }
    } catch (error) {
      return reject({
        statusCode: "1",
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.deleteById = (emergencyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const emergency = await emergencyDao.deleteEmergencyFundById(emergencyId);
      if (emergency) {
        return resolve({
          statusCode: "0",
          message: "emergency data deleted successfully",
        });
      }
    } catch (error) {
      return reject({
        statusCode: "1",
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};
