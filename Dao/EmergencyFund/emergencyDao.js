
const EmergencyFund = require("../../Models/EmergencyFund/emergencyModel");

exports.createEmergencyFund = async (data) => {
  const emergencyFund = new EmergencyFund(data);
  await emergencyFund.save();
  return emergencyFund;
};

exports.updateEmergencyFund = async (emergencyId, data) => {
  return await EmergencyFund.findByIdAndUpdate(emergencyId, data, {
    new: true,
  });
};

exports.getEmergencyFundByUserId = async (userId) => {
  return await EmergencyFund.find({ userId });
};

exports.getEmergencyFundById = async (emergencyId) => {
  return await EmergencyFund.findById(emergencyId);
};

exports.deleteEmergencyFundById = async (emergencyId) => {
  return await EmergencyFund.findByIdAndDelete(emergencyId);
};
