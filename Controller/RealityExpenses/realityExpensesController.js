const realityExpensesService = require("../../Service/RealityExpenses/realityExpensesService");

exports.createExpense = async (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { userId, month, year, title, categories } = req.body;

  try {
    const newExpense = await realityExpensesService.createExpense(
      userId, month, year, title, categories
    );

    res.status(201).json({ message: "Expense created successfully", newExpense });
  } catch (error) {
    console.error("Error creating expense:", error); // Log the error details
    res.status(500).json({ 
      message: "Error creating expense", 
      error: error.message || JSON.stringify(error) 
    });
  }
};

exports.getAllExpenses = async (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  try {
    const expenses = await realityExpensesService.getAllExpenses();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

exports.getExpenseById = async (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { id } = req.params;

  try {
    const expense = await realityExpensesService.getExpenseById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expense", error });
  }
};

exports.updateExpense = async (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { id } = req.params;
  const { title, categories } = req.body;

  try {
    const updatedExpense = await realityExpensesService.updateExpense(
      id, title, categories
    );
    res.status(200).json({ message: "Expense updated successfully", updatedExpense });
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
};

exports.deleteExpense = async (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { id } = req.params;

  try {
    await realityExpensesService.deleteExpense(id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
};
