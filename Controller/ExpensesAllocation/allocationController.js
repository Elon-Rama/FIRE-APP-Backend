const allocationService = require("../../Service/ExpensesAllocation/allocationService");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, titles, month, year } = req.body;
  if (!userId || !titles || !month || !year) {
    return res.status(200).json({ error: "All fields are required" });
  }
  const result = await allocationService.upsertAllocation(
    userId,
    titles,
    month,
    year
  );
  allocationService
    .upsert(result)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server Error" });
    });
};

exports.copyPreviousMonthData = async (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, month, year } = req.body;
  if (!userId || !month || !year) {
    return res.status(200).json({ error: "All fields are required" });
  }
  const result = await allocationService.copyPreviousMonthData(
    userId,
    month,
    year
  );
  allocationService
    .copyPreviousMonthData(result)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server Error" });
    });
};

exports.updateExpenseAmount = async (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, entryId, amount } = req.body;
  if (!userId || !entryId || !amount) {
    return res.status(200).json({ error: "All fields are required" });
  }
  const result = await allocationService.updateExpenseAmount(
    userId,
    entryId,
    amount
  );
  allocationService
    .updateExpenseAmount(result)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server Error" });
    });
};

exports.postSubCategoryValues = async (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, month, year, selectedMaster, selectedCategory, amount } =
    req.body;
  if (
    !userId ||
    !month ||
    !year ||
    !selectedMaster ||
    !selectedCategory ||
    !amount
  ) {
    return res.status(200).json({ error: "All fields are required" });
  }
  const result = await allocationService.updateSubCategoryValues(
    userId,
    month,
    year,
    selectedMaster,
    selectedCategory,
    amount
  );
  allocationService
    .updateSubCategoryValues(result)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server Error" });
    });
};

exports.getAll = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, month, year } = req.body;
  if (!userId || !month || !year) {
    return res.status(200).json({ error: "All fields are required" });
  }

  allocationService
    .getAllAllocations(userId, month, year)
    .then((result) => {
      return allocationService.getAll(result);
    })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getById = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, month, year } = req.params;

  if (!userId || !month || !year) {
    return res.status(400).json({ error: "All fields are required" });
  }

  allocationService
    .getAllocationById(userId, month, year)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.error("Error fetching allocation by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.delete = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { allocationId } = req.params;

  if (!allocationId) {
    return res.status(400).json({ error: "Allocation ID is required" });
  }

  allocationService
    .deleteAllocation(allocationId)
    .then((result) => {
      if (result.statusCode === "0") {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: "Allocation not found" });
      }
    })
    .catch((error) => {
      console.error("Error deleting allocation:", error);
      res.status(500).json({
        statusCode: "1",
        message: "Internal Server Error",
      });
    });
};
