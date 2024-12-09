const riskService = require("../../Service/personalRiskTolerance/riskService");

exports.saveRiskProfile = (req, res) => {
  //#swagger.tags=['PersonalRisk-Tolerance']
  const { userId, answers } = req.body;
  if ((!userId, !answers)) {
    return res.status(200).json({ error: "All fields are required" });
  }
  const RiskProfile = {
    userId,
    answers
  }
  riskService
    .saveRiskProfile(RiskProfile)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.getRiskProfile = (req, res) => {
  //#swagger.tags=['PersonalRisk-Tolerance']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({ error: "userId is required" });
  }
  riskService
  .getRiskProfile(userId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server error" });
    });
};
