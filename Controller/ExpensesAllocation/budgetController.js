const budgetService = require("../../Service/ExpensesAllocation/budgetService");

exports.create = (req, res) => {
  //#swagger.tags = ['Budgetplan-income']
  const { month, year, income, otherIncome = [], userId } = req.body;

  if (!month || !year || !income || !userId) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  if (!Array.isArray(otherIncome)) {
    return res.status(400).json({
      success: false,
      message: "'otherIncome' should be an array",
    });
  }

  const budget = { month, year, income, otherIncome, userId };

  budgetService
    .create(budget)
    .then((response) => {
      res.status(201).json({
        success: true,
        message: "Budget-plan income created successfully",
        budget: response,
      });
    })
    .catch((error) => {
      console.error("Error creating budget:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create budget",
        error: error.message,
      });
    });
};

exports.update = (req, res) => {
  //#swagger.tags = ['Budgetplan-income']
  const { budgetId } = req.params;
  const budgetData = req.body;

  budgetService
    .updateBudget(budgetId, budgetData)
    .then((updatedBudget) => {
      res.status(201).json({
        success: true,
        message: "Budget updated successfully",
        budget: updatedBudget,
      });
    })
    .catch((error) => {
      console.error("Error updating budget:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update budget",
        error: error.message,
      });
    });
};

exports.getById = (req, res) => {
  //#swagger.tags = ['Budgetplan-income']
  const { budgetId } = req.params;

  if (!budgetId) {
    return res.status(200).json({
      success: false,
      message: "BudgetId is required",
    });
  }

  budgetService
    .getBudgetById(budgetId)
    .then((response) => {
      res.status(201).json({
        success: true,
        message: "Budget retrieved successfully",
        budget: response,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve budget",
        error: error.message,
      });
    });
};

exports.view = (req, res) => {
  //#swagger.tags = ['Budgetplan-income']
  const { month, year, userId } = req.query;

  if (!month || !year || !userId) {
    return res.status(200).json({
      success: false,
      message: "Month, Year, and UserId are required",
    });
  }

  budgetService
    .View({ month, year, userId })
    .then((response) => {
      res.status(201).json({
        success: true,
        message: "Budget retrieved successfully",
        budget: response,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve budget",
        error: error.message,
      });
    });
};
exports.delete = (req, res) => {
   //#swagger.tags = ['Budgetplan-income']
  const { budgetId } = req.params;

  if (!budgetId) {
    return res.status(200).json({
      success: false,
      message: "BudgetId is required",
    });
  }

  budgetService
    .deleteBudget(budgetId)
    .then((response) => {
      res.status(201).json({
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

exports.calculateBudget = (req, res) => {
  //#swagger.tags = ['Budgetplan-income']
  const { month, year, userId } = req.query;

  if (!month || !year || !userId) {
    return res.status(200).json({
      success: false,
      message: "Month, Year, and UserId are required",
    });
  }

  budgetService
    .calculateBudget(month, year, userId)
    .then((budgetCalculation) => {
      res.status(201).json({
        success: true,
        message: "Budget calculated successfully",
        budget: budgetCalculation,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to calculate budget",
        error: error.message,
      });
    });
};
