const allocationService = require("../../Service/ExpensesAllocation/allocationService");

exports.upsert = (req, res) => {
  const { userId, titles, month, year } = req.body;
  return allocationService
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
  const { userId, month, year } = req.body;
  return allocationService
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
  const { userId, entryId, amount } = req.body;
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
  const { userId, month, year, selectedMaster, selectedCategory, amount } =
    req.body;
  return allocationService
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
  const { userId, month, year } = req.body;
  return allocationService
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
  const { userId, month, year } = req.params;
  return allocationService
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
  const { allocationId } = req.params;
  return allocationService
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
