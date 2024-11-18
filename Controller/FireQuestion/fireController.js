
const fireService = require("../../Service/FireQuestion/fireService");

exports.create = async (req, res) => {
  //#swagger.tags = ['Questionpage']
  console.log("Request Body:", req.body);
  const {
    userId,
    occupation,
    city,
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

  // Validate input fields
  if (
    !userId ||
    !occupation ||
    !city ||
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
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Prepare the data object
  const data = {
    userId,
    occupation,
    city,
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
    // Call the service to create fire data
    const response = await fireService.create(data);

    // Send success response
    res.status(201).json(response);
  } catch (error) {
    // Handle error in the service
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create FireQuestion, please try again",
    });
  }
};

exports.calculate = async (req, res) => {
  //#swagger.tags = ['Questionpage']
  try {
    const { fireId } = req.params;
    const response = await fireService.calculateRetirement(fireId);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating retirement",
      error: error.message,
    });
  }
};



/*const FireService = require("../../Service/FireQuestion/fireService");
const { validationResult } = require("express-validator");

exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const response = await FireService.createFireQuestion(req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating FireQuestion",
      error: error.message,
    });
  }
};

exports.calculate = async (req, res) => {
  try {
    const { fireId } = req.params;
    const response = await FireService.calculateRetirement(fireId);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating retirement",
      error: error.message,
    });
  }
};
*/