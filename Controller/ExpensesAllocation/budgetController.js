const budgetService = require('../../Service/ExpensesAllocation/budgetService');

exports.Create = async (req, res) => {
  try {
    const budgetData = req.body;
    const createdBudget = await budgetService.createBudget(budgetData);
    return res.status(201).json({
      message: 'Budget created successfully',
      budget: createdBudget,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create budget',
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const budgetData = req.body;
    const updatedBudget = await budgetService.updateBudget(id, budgetData);
    return res.status(200).json({
      message: 'Budget updated successfully',
      budget: updatedBudget,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update budget',
      error: error.message,
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await budgetService.getBudgetById(id);
    return res.status(200).json({
      message: 'Budget retrieved successfully',
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to retrieve budget',
      error: error.message,
    });
  }
};

exports.calculateBudget = async (req, res) => {
  try {
    const { month, year, userId } = req.query;
    const budgetCalculation = await budgetService.calculateBudget(month, year, userId);
    return res.status(200).json({
      message: 'Budget calculated successfully',
      ...budgetCalculation,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to calculate budget',
      error: error.message,
    });
  }
};
