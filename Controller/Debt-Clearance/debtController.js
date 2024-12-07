const debtService = require("../../Service/Debt-Clearance/debtService");

exports.createDebt = async (req, res) => {
  //#swagger.tags=['Debt-Clearance']
  try {
    const { userId, source } = req.body;
    if (!userId || !source || !Array.isArray(source)) {
      return res.status(400).json({
        statusCode: "1",
        message: "Invalid request data. Please provide a valid userId and source array.",
      });
    }

    const result = await debtService.createOrUpdateDebt(userId, source);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating/updating debt clearance:", error);
    res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.getAllDebts = async (req, res) => {
  //#swagger.tags=['Debt-Clearance']
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        statusCode: "1",
        message: "Invalid request. Please provide a valid userId.",
      });
    }

    const result = await debtService.getAllDebts(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching debt clearance records:", error);
    res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.payEMI = async (req, res) => {
  //#swagger.tags=['Debt-Clearance']
  try {
    const { userId, loanId, emiPaid } = req.body;
    if (!emiPaid) {
      return res.status(400).json({ message: "EMI amount is required." });
    }

    const result = await debtService.payEMI(userId, loanId, emiPaid);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
