const DebtClearance = require("../../Models/Debt-Clearance/debtModel");

exports.upsertDebt = async (userId, enrichedSource) => {
  const existingDebt = await DebtClearance.findOne({ userId });

  if (existingDebt) {
    existingDebt.source.push(...enrichedSource);
    const updatedDebt = await existingDebt.save();
    return {
      statusCode: "0",
      message: "Debt clearance updated successfully",
      userId: updatedDebt.userId,
      debtId: updatedDebt._id,
      data: {
        source: updatedDebt.source,
      },
    };
  }

  const newDebtClearance = new DebtClearance({ userId, source: enrichedSource });
  const savedDebt = await newDebtClearance.save();
  return {
    statusCode: "0",
    message: "Debt clearance created successfully",
    userId: savedDebt.userId,
    debtId: savedDebt._id,
    data: {
      source: savedDebt.source,
    },
  };
};

exports.getDebtByUserId = (userId) => {
  return DebtClearance.findOne({ userId });
};
