const User = require("../../Models/Login/emailModel");
const EmergencyFund = require("../../Models/EmergencyFund/emergencyModel");

exports.findUserById = async (userId) => {
  return await User.findById(userId);
};

exports.createEmergencyFund = async (data) => {
  const emergencyFund = new EmergencyFund(data);
  return await emergencyFund.save();
};

exports.updateEmergencyFund = async (emergencyId, updatedFund) => {
  return await EmergencyFund.findByIdAndUpdate(
    emergencyId,
    updatedFund,
    { $set: updatedFund },
    { new: true, upsert: true }
  );
};

exports.getEmergencyFundByUserId = async (userId) => {
  return await EmergencyFund.findById({ userId });
};

exports.getEmergencyFundById = async (emergencyId) => {
  return await EmergencyFund.findById(emergencyId);
};

exports.getEmergencyFundByUserId = async (userId) => {
  return await EmergencyFund.find({ userId });
};

exports.deleteEmergencyFundById = async (emergencyId) => {
  return await EmergencyFund.findByIdAndDelete(emergencyId);
};
