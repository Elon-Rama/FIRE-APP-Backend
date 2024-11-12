const insuranceService = require("../../Service/Insurance/insuranceService");

exports.createInsurance = (req, res) => {
  const insuranceData = req.body;

  insuranceService
    .addInsurance(insuranceData)
    .then((newInsurance) => {
      res.status(201).json({
        message: "Insurance created successfully",
        data: newInsurance,
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: error.message || "Error creating insurance",
      });
    });
};

exports.updateInsurance = (req, res) => {
  const insuranceId = req.params.id;
  const updateData = req.body;

  insuranceService
    .updateInsurance(insuranceId, updateData)
    .then((updatedInsurance) => {
      res.status(200).json({
        message: "Insurance updated successfully",
        data: updatedInsurance,
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: error.message || "Error updating insurance",
      });
    });
};

exports.getInsuranceById = (req, res) => {
  const insuranceId = req.params.id;

  insuranceService
    .getInsuranceById(insuranceId)
    .then((insurance) => {
      if (!insurance) {
        return res.status(404).json({ message: "Insurance not found" });
      }
    //   res.status(200).json(insurance);
    res.status(200).json({
        message : "Insurance id retrived successfully",
        data : insurance,
    });
    })
    .catch((error) => {
      res.status(200).json({
        message: error.message || "Error retrieving insurance",
      });
    });
};

exports.getAllInsurances = (req, res) => {
  insuranceService
    .getAllInsurances()
    .then((insurances) => {
   
    res.status(200).json({
        message: "Insurance retrived successfully",
        data: insurances,
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: error.message || "Error retrieving insurances",
      });
    });
};

exports.deleteInsurance = (req, res) => {
  const insuranceId = req.params.id;

  insuranceService
    .deleteInsurance(insuranceId)
    .then(() => {
      res.status(200).json({ message: "Insurance deleted successfully" });
    })
    .catch((error) => {
      res.status(200).json({
        message: error.message || "Error deleting insurance",
      });
    });
};
