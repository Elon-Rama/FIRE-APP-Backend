const allocationService = require("../../Service/ExpensesAllocation/allocationService");

exports.upsert = async (req, res) => {
  try {
    const { userId, titles, month, year } = req.body;
    const result = await allocationService.upsertAllocation(
      userId,
      titles,
      month,
      year
    );

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.copyPreviousMonthData = async (req, res) => {
  try {
    const { userId, month, year } = req.body;
    const response = await allocationService.copyPreviousMonthData(
      userId,
      month,
      year
    );
    return res.status(response.statusCode).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.updateExpenseAmount = async (req, res) => {
  try {
    const { userId, entryId, amount } = req.body;
    const response = await allocationService.updateExpenseAmount(
      userId,
      entryId,
      amount
    );
    return res.status(response.statusCode).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.postSubCategoryValues = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  try {
    const { userId, month, year, selectedMaster, selectedCategory, amount } =
      req.body;
    const result = await allocationService.updateSubCategoryValues(
      userId,
      month,
      year,
      selectedMaster,
      selectedCategory,
      amount
    );
    return res.status(result.statusCode === "0" ? 201 : 400).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  const { userId, month, year } = req.body;
  try {
    const result = await allocationService.getAllAllocations(
      userId,
      month,
      year
    );
    return res.status(result.statusCode === "0" ? 200 : 404).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.getById = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  try {
    const { userId, month, year } = req.params;
    const result = await allocationService.getAllocationById(
      userId,
      month,
      year
    );
    return res.status(result.statusCode === "0" ? 200 : 404).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.delete = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  const { allocationId } = req.params;
  try {
    const result = await allocationService.deleteAllocation(allocationId);
    return res.status(result.statusCode === "0" ? 200 : 404).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};
