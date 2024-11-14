
const budgetIncomeService = require("../../Service/RealityExpenses/budgetIncomeService");

exports.createIncome = async (req, res) => {
  const { userId, month, year, date, income, otherIncome } = req.body;

  if (!userId || !month || !year || !date || !income || !Array.isArray(otherIncome)) {
    return res.status(400).json({ success: false, message: "All fields are required, and otherIncome should be an array." });
  }

  try {
    const newIncome = await budgetIncomeService.createIncome({ userId, month, year, date, income, otherIncome });
    res.status(201).json({ success: true, message: "Income created successfully", data: newIncome });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getIncomeById = async (req, res) => {
  const { id } = req.params;

  try {
    const income = await budgetIncomeService.getIncomeById(id);
    res.status(200).json({ success: true, data: income });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.updateIncome = async (req, res) => {
  const { id } = req.params;
  const { month, year, date, income, otherIncome, userId } = req.body;

  if (!month || !year || !date || !income || !Array.isArray(otherIncome)) {
    return res.status(400).json({ success: false, message: "All fields are required, and otherIncome should be an array." });
  }

  try {
    const updatedIncome = await budgetIncomeService.updateIncome(id, { month, year, date, income, otherIncome, userId });
    res.status(200).json({ success: true, message: "Income updated successfully", data: updatedIncome });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  const { id } = req.params;

  try {
    await budgetIncomeService.deleteIncome(id);
    res.status(200).json({ success: true, message: "Income deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.viewIncome = async (req, res) => {
  const { userId, month, year } = req.query;

  try {
    const incomes = await budgetIncomeService.viewIncome(userId, month, year);
    res.status(200).json({ success: true, data: incomes });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
