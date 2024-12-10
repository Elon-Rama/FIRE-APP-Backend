const emergencyService = require("../../Service/EmergencyFund/emergencyService");

exports.upsert = (req, res) => {
  //#swagger.tags=['Emergency-Fund']
  const {
    userId,
    monthlyExpenses,
    monthsNeed,
    savingsperMonth,
    initialEntry,
    emergencyId,
  } = req.body;
  if (
    (!userId, !monthlyExpenses, !monthsNeed, !savingsperMonth, !initialEntry)
  ) {
    return res.status(200).json({ error: "All fields are required" });
  }
  const emergency = {
    userId,
    monthlyExpenses,
    monthsNeed,
    savingsperMonth,
    initialEntry,
    emergencyId,
  };
  emergencyService
    .upsert(emergency)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.getAll = (req, res) => {
  //#swagger.tags=['Emergency-Fund']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({ error: "userId is required" });
  }
  emergencyService
    .getAll(userId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server error" });
    });
};

exports.getById = (req, res) => {
  //#swagger.tags=['Emergency-Fund']
  const { emergencyId } = req.params;
  if (!emergencyId) {
    return res.status(200).json({ error: "emergencyId is required" });
  }
  emergencyService
    .getById(emergencyId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};

exports.deleteById = (req, res) => {
  //#swagger.tags=['Emergency-Fund']
  const { emergencyId } = req.params;
  if (!emergencyId) {
    return res.status(200).json({ error: "emergencyId is required" });
  }
  emergencyService
    .deleteById(emergencyId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};
