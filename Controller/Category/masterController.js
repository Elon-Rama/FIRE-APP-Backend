const masterService = require("../../Service/Category/masterService");

exports.upsertExpense = (req, res) => {
  //#swagger.tags=['Master-Expenses']
  const { userId, title, masterId } = req.body;
  if ((!userId, !title)) {
    return res.status(200).json({ error: "All fields are required" });
  }
  const expensesMaster = {
    userId,
    title,
    masterId,
  };
  masterService
    .upsertExpense(expensesMaster)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.getAllExpenses = (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({ message: "All fields are required" });
  }
  masterService
    .getAllExpenses(userId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Internal Server error" });
    });
};

exports.getExpenseById = (req, res) => {
   //#swagger.tags=['Master-Expenses']
  const { masterId } = req.params;
  if (!masterId) {
    return res.status(200).json({ error: "masterId is required" });
  }
  masterService
    .getExpenseById(masterId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};

exports.deleteById = (req, res) => {
   //#swagger.tags=['Master-Expenses']
  const { masterId } = req.params;
  if (!masterId) {
    return res.status(200).json({ error: "masterId is required" });
  }
  masterService
    .deleteById(masterId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};
