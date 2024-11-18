const FireQuestion = require("../../Models/FireQuestion/fireModel");
const User = require("../../Models/Login/emailModel");

exports.create = async (data) => {
  const fireQuestion = new FireQuestion(data);
  return await fireQuestion.save();
};

exports.findFireQuestionById = async (id) => {
  return await FireQuestion.findById(id);
};

exports.updateFireQuestionWithCalculation = async (id, calculationData) => {
  return await FireQuestion.findByIdAndUpdate(id, calculationData, { new: true });
};

exports.findUserById = async (id) => {
  return await User.findById(id);
};
