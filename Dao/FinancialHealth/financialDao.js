const Financial = require('../../Models/FinancialHealth/financialModel');
const User = require('../../Models/Login/emailModel');

exports.findUserById = async (id) => {
    return await User.findById(id);
  };

  exports.createFinancialData = async (data) => {
    const financial = new Financial(data);
    return await financial.save();
  };

  exports.getUserFinancial = async(userId)=>{
    return await Financial.findOne({ userId });
  }