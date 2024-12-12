const fireService = require("../../Service/FireQuestion/fireService");

exports.Create = async (req, res) => {
  //#swagger.tags = ['Fire-QuestionPage']
  const {
    userId,
    
    age,
    retireage,
    expense,
    inflation,
    monthlysavings,
    retirementsavings,
    prereturn,
    postreturn,
    expectancy,
  } = req.body;

  if (
    !userId ||
   
    !age ||
    !retireage ||
    !expense ||
    !inflation ||
    !monthlysavings ||
    !retirementsavings ||
    !prereturn ||
    !postreturn ||
    !expectancy
  ) {
    return res.status(200).json({
      success: false,
      message: "All fields are required",
    });
  }

  const data = {
    userId,
    
    age,
    retireage,
    expense,
    inflation,
    monthlysavings,
    retirementsavings,
    prereturn,
    postreturn,
    expectancy,
  };

  try {
    const response = await fireService.create(data);

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to create FireQuestion, please try again",
    });
  }
};

exports.Calculate = (req, res) => {
  //#swagger.tags = ['Fire-QuestionPage']
  const { fireId } = req.params;

  if (!fireId) {
    return res.status(400).json({ error: "fireId not Found" });
  }

  fireService
    .calculate(fireId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({
          error: "Error calculating retirement",
          details: error.message,
        });
    });
};
