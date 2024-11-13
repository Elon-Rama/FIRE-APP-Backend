const expensesService = require("../../Service/Category/masterService");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  const { userId, title, id } = req.body;
  try {
    const result = await expensesService.upsertExpense(userId, title, id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ statusCode: "1", message: error.message });
  }
};

exports.getAll = async (req, res) => {
   //#swagger.tags = ['Master-Expenses']
  const { userId } = req.query;
  try {
    const result = await expensesService.getAllExpenses(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ statusCode: "1", message: error.message });
  }
};

exports.getById = async (req, res) => {
   //#swagger.tags = ['Master-Expenses']
  try {
    const result = await expensesService.getExpenseById(req.params.expenses_id);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        statusCode: "1",
        message: "Failed to retrieve expense data",
        error: error.message,
      });
  }
};

exports.deleteById = async (req, res) => {
   //#swagger.tags = ['Master-Expenses']
  try {
    const result = await expensesService.toggleExpenseStatus(
      req.params.expenses_id
    );
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        statusCode: "1",
        message: "Failed to update expense status",
        error: error.message,
      });
  }
};
