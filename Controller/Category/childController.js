const childExpensesService = require("../../Service/Category/childService");

exports.upsert = async (req, res) => {
   //#swagger.tags = ['Child-Expenses']
  const { expensesId, category, userId } = req.body;

  try {
    const result = await childExpensesService.upsert(
      expensesId,
      category,
      userId
    );
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: error.message || "Internal server error",
    });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { userId } = req.query;

  try {
    const result = await childExpensesService.getAll(userId);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve subcategories data",
    });
  }
};

exports.getChildByMaster = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { userId, title } = req.body;

  try {
    const result = await childExpensesService.getChildByMaster(userId, title);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve subcategories data",
    });
  }
};

exports.delete = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { id } = req.params;

  try {
    const result = await childExpensesService.delete(id);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: "Internal server error",
    });
  }
};

exports.search = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const searchTerm = req.query.searchTerm;

  try {
    const result = await childExpensesService.search(searchTerm);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: "Internal server error",
    });
  }
};
