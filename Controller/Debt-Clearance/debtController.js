const debtService = require('../../Service/Debt-Clearance/debtService');

exports.createDebt = async (req, res) => {
  try {
    const { userId, source } = req.body;

    const result = await debtService.createDebt(userId, source);

    const totalDebt = result.source.reduce(
      (sum, loan) => sum + parseFloat(loan.debtAmount),
      0
    );
    const totalMonths = result.source.reduce(
      (sum, loan) =>
        sum +
        debtService.calculateLoanData(
          parseFloat(loan.amount),
          loan.RateofInterest,
          loan.EMI
        ).totalMonths,
      0
    );

    const consolidatedYearstorepaid = `${Math.floor(totalMonths / 12)} years ${
      totalMonths % 12
    } months`;

    return res.status(200).json({
      statusCode: "0",
      message: "Debt data processed successfully",
      userId,
      data: {
        ...result._doc,
        TotalDebt: totalDebt.toFixed(2),
        yearstorepaid: consolidatedYearstorepaid,
      },
    });
  } catch (error) {
    return res.status(500).json({ statusCode: "1", message: error.message });
  }
};

exports.getAllDebts = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        statusCode: "1",
        message: "User ID is required",
      });
    }

    const result = await debtService.getAllDebts(userId);

    return res.status(200).json({
      statusCode: "0",
      message: "Debt records retrieved successfully",
      userId,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: "1",
      message: error.message,
    });
  }
};
