const financialService = require("../../Service/FinancialHealth/financialService");

exports.createFinancialData = (req, res) => {
  //#swagger.tags=['Financial-Health']
  const {
    userId,
    income = 0,
    expenses = 0,
    debtAmount = 0,
    monthlyEmi = 0,
    insurance = "None",
    emergencyFund = 0,
    investments = [],
  } = req.body;

  if (
    !userId ||
    income === undefined ||
    expenses === undefined ||
    debtAmount === undefined ||
    monthlyEmi === undefined ||
    !insurance ||
    emergencyFund === undefined ||
    !Array.isArray(investments)
  ) {
    return res.status(400).json({
      statusCode: "1",
      message: "All fields are required. Please provide valid data.",
    });
  }

  const financialData = {
    userId,
    income,
    expenses,
    debtAmount,
    monthlyEmi,
    insurance,
    emergencyFund,
    investments,
  };

  financialService
    .createFinancialData(financialData)
    .then((response) => {
      res.status(201).json({
        statusCode: "0",
        message: "Financial data created successfully",
        data: response,
      });
    })
    .catch((error) => {
      console.error("Error creating financial data:", error);
      res.status(500).json({
        statusCode: "1",
        message: "Internal Server Error",
      });
    });
};

exports.getUserFinancial = (req, res) => {
  //#swagger.tags=['Financial-Health']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({ error: "UserId is required" });
  }
  financialService
    .getUserFinancial(userId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};
