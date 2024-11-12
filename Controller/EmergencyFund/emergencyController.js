const emergencyService = require("../../Service/EmergencyFund/emergencyService");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Emergency-Fund']
  const {
    userId,
    monthlyExpenses,
    monthsNeed,
    savingsperMonth,
    initialEntry,
    emergencyId,
  } = req.body;

  try {
    const emergencyFund = await emergencyService.upsertEmergencyFund(
      userId,
      monthlyExpenses,
      monthsNeed,
      savingsperMonth,
      initialEntry,
      emergencyId
    );

    res.status(201).json({
      statusCode: "0",
      message: emergencyId
        ? "Emergency Fund updated successfully"
        : "Emergency Fund created successfully",
      data: emergencyFund,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['Emergency-Fund']
  const { userId } = req.query;

  try {
    const emergencyFunds = await emergencyService.getEmergencyFundByUserId(
      userId
    );

    if (emergencyFunds.length === 0) {
      return res.status(200).json({
        statusCode: "1",
        message: "No Expenses found for the provided userId",
      });
    }

    res.status(200).json({
      statusCode: "0",
      message: "Expenses retrieved successfully",
      data: emergencyFunds,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: error.message,
    });
  }
};

exports.getById = async (req, res) => {
  //#swagger.tags = ['Emergency-Fund']
  try {
    const emergency = await emergencyService.getEmergencyFundById(
      req.params.emergency_id
    );

    if (emergency) {
      res.status(200).json({
        statusCode: "0",
        message: "Emergency Id retrieved successfully",
        data: emergency,
      });
    } else {
      res.status(404).json({
        message: "Emergency Id not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve emergency data",
    });
  }
};

exports.deleteById = async (req, res) => {
  //#swagger.tags = ['Emergency-Fund']
  try {
    const emergency = await emergencyService.deleteEmergencyFundById(
      req.params.emergency_id
    );

    if (emergency) {
      res.status(200).json({
        message: "Emergency data deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "No emergency data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete emergency",
    });
  }
};
