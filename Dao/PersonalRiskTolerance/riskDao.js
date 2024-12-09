const Risk = require('../../Models/personalRiskTolerance/riskModel');
const User = require('../../Models/Login/emailModel');

exports.findUserById = async (id) => {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new Error("Failed to find user. Please check the user ID.");
    }
  };
  
  exports.createRisk = async (data) => {
    try {
      const risk = new Risk(data);
      return await risk.save();
    } catch (error) {
      throw new Error("Failed to save risk data.");
    }
  };
  
  exports.findLatestRiskProfile = async (userId) => {
    try {
      return await Risk.findOne({ userId }).sort({ createdAt: -1 }); 
    } catch (error) {
      throw new Error("Failed to retrieve the latest risk profile. Please check the user ID.");
    }
  };
  