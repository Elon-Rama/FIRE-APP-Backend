const budgetService = require("../../Service/Reality/budgetService");

exports.createIncome = (req, res) => {
  //#swagger.tags = ['Reality-budgetIncome']
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
    .createIncome(budget)
    .then((response) => {
      res.status(201).json({
        success: true,
        message: "Budget created successfully",
        data: response,
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

exports.updateIncome = (req, res) => {
 //#swagger.tags = ['Reality-budgetIncome']
  const { budgetId } = req.params;
  const budgetData = req.body;

  budgetService
    .updateIncome(budgetId, budgetData)
    .then((updatedBudget) => {
      res.status(200).json({
        success: true,
        message: "Budget updated successfully",
        data: updatedBudget,
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

exports.getIncomeById = (req, res) => {
 //#swagger.tags = ['Reality-budgetIncome']
  const { budgetId } = req.params;

  if (!budgetId) {
    return res.status(400).json({
      success: false,
      message: "BudgetId is required",
    });
  }

  budgetService
    .getIncomeById(budgetId)
    .then((response) => {
      res.status(200).json({
        success: true,
        message: "Budget retrieved successfully",
        data: response,
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

exports.viewIncome = (req, res) => {
 //#swagger.tags = ['Reality-budgetIncome']
  const { month, year, userId } = req.query;

  if (!month || !year || !userId) {
    return res.status(400).json({
      success: false,
      message: "Month, Year, and UserId are required",
    });
  }

  budgetService
    .viewIncome({ month, year, userId })
    .then((response) => {
      res.status(200).json({
        success: true,
        message: "Budget retrieved successfully",
        data: response,
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
exports.deleteIncome = (req, res) => {
  //#swagger.tags = ['Reality-budgetIncome']
  const { budgetId } = req.params;

  if (!budgetId) {
    return res.status(400).json({
      success: false,
      message: "BudgetId is required",
    });
  }

  budgetService
    .deleteIncome(budgetId)
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
