const RealityExpense = require('../../Models/Reality/expensesReality');
const User = require('../../Models/Login/emailModel');

exports.findUserById = async (userId) => {
    return await User.findById(userId);
  };

exports.createExpense = async(data)=>{
    const newExpense = new RealityExpense(data);
    return await newExpense.save();
}

exports.getExpensesByUserId = async(userId) =>{
    return await RealityExpense.find({ userId });
}

exports.getExpensesById = async(expensesId) =>{
    return await RealityExpense.findById(expensesId)
}

exports.deleteBudget = async (expensesId) => {
    return await RealityExpense.findByIdAndDelete(expensesId);
  };

  exports.updateExpenses = async (expensesId, updateData) => {
    return await RealityExpense.findByIdAndUpdate(
      expensesId,
      updatedExpenseData,
      { new: true }
    );
  }; 