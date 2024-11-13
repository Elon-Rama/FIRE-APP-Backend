const FireService = require("../../Service/FireQuestion/fireService");
const { validationResult } = require("express-validator");

exports.create = async (req, res) => {
  //#swagger.tags = ['Questionpage-FIRE']
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
  //#swagger.tags = ['Questionpage-FIRE']
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
