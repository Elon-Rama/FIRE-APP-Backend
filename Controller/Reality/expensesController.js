const realityService = require("../../Service/Reality/expensesService");

exports.createExpense = (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { userId, month, year, title, categories } = req.body;
  if ((!userId, !month, !year, !title, !categories)) {
    return res.status(200).json({ error: "All fields are required" });
  }
  const expensesData = {
    userId,
    month,
    year,
    title,
    categories,
  };
  realityService
    .createExpense(expensesData)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server error" });
    });
};

exports.getAllExpenses = (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({ error: "userId is required" });
  }
  realityService
    .getAllExpenses(userId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server error" });
    });
};

exports.getExpenseById = (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { expensesId } = req.params;

  if (!expensesId) {
    return res.status(400).json({
      success: false,
      message: "expensesId is required",
    });
  }

  realityService
    .getExpenseById(expensesId)
    .then((response) => {
      res.status(200).json({
        success: true,
        message: "expenses retrieved successfully",
        data: response,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve expenses",
        error: error.message,
      });
    });
};

exports.updateExpense = (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { expensesId } = req.params;
  const { title, categories } = req.body;

  if (!title || !categories || !expensesId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const updateData = {
    title,
    categories,
  };

  realityService
    .updateExpense(expensesId, updateData) // Pass expensesId and updateData explicitly
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server error" });
    });
};

exports.deleteExpense = (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { expensesId } = req.params;

  if (!expensesId) {
    return res.status(400).json({
      success: false,
      message: "expensesId is required",
    });
  }

  realityService
    .deleteExpense(expensesId)
    .then((response) => {
      res.status(200).json({
        success: true,
        message: response.message,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to delete budget",
        error: error.message,
      });
    });
};
