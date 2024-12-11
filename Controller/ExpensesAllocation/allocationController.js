const allocationService = require("../../Service/ExpensesAllocation/allocationService");

exports.upsert = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, titles, month, year } = req.body;
  if ((!userId, !month, !year, !titles)) {
    return res.status(200).json({ error: "All fields are Required" });
  }
  allocationService
    .upsertAllocation(userId, titles, month, year)
    .then((result) => res.status(201).json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        statuscode: "1",
        message: "Internal Server Error",
      });
    });
};

exports.copyPreviousMonthData = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, month, year } = req.body;
  if ((!userId, !month, !year)) {
    return res.status(200).json({ error: "All fields are Required" });
  }
  allocationService
    .copyPreviousMonthData(userId, month, year)
    .then((response) => res.status(response.statusCode).json(response))
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        statuscode: "1",
        message: "Internal Server Error",
      });
    });
};

exports.updateExpenseAmount = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, entryId, amount } = req.body;
  if ((!userId, !entryId, !amount)) {
    return res.status(200).json({ error: "All fields are required" });
  }
  return allocationService
    .updateExpenseAmount(userId, entryId, amount)
    .then((response) => res.status(response.statusCode).json(response))
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        statusCode: "1",
        message: "Internal Server Error",
      });
    });
};

exports.postSubCategoryValues = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, month, year, selectedMaster, selectedCategory, amount } =
    req.body;
  if ((!userId, !month, !year, !selectedMaster, !selectedCategory, !amount)) {
    return res.status(200).json({ error: "All fields are required" });
  }
  allocationService
    .updateSubCategoryValues(
      userId,
      month,
      year,
      selectedMaster,
      selectedCategory,
      amount
    )
    .then((result) =>
      res.status(result.statusCode === "0" ? 201 : 400).json(result)
    )
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        statusCode: "1",
        message: "Internal Server Error",
      });
    });
};

exports.getAll = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, month, year } = req.body;
  if ((!userId, !month, !year)) {
    return res.status(200).json({ error: "All fields are Required" });
  }
  allocationService
    .getAllAllocations(userId, month, year)
    .then((result) =>
      res.status(result.statusCode === "0" ? 200 : 404).json(result)
    )
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        statusCode: "1",
        message: "Internal Server Error",
      });
    });
};

exports.getById = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, month, year } = req.params;
  if ((!userId, !month, !year)) {
    return res.status(200).json({ error: "All fields are Required" });
  }
  allocationService
    .getAllocationById(userId, month, year)
    .then((result) =>
      res.status(result.statusCode === "0" ? 200 : 404).json(result)
    )
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        statusCode: "1",
        message: "Internal Server Error",
      });
    });
};

exports.delete = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { allocationId } = req.params;
  if (!allocationId) {
    return res.status(200).json({ error: "allocationId is required" });
  }
  allocationService
    .deleteAllocation(allocationId)
    .then((result) =>
      res.status(result.statusCode === "0" ? 200 : 404).json(result)
    )
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        statusCode: "1",
        message: "Internal Server Error",
      });
    });
};
