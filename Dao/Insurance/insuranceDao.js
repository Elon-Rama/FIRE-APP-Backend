const Insurance = require("../../Models/Insurance/insuranceModel");
const User = require("../../Models/Login/emailModel");

exports.users = (userId) => {
  return User.exists({ _id: userId });
};

exports.createInsurance = (data) => {
  const insurance = new Insurance(data);
  return insurance.save();
};

exports.createInsurance = (data) => {
  const insurance = new Insurance(data);
  return insurance.save();
};

exports.updateInsuranceById = (id, updateData) => {
  return Insurance.findByIdAndUpdate(id, updateData, { new: true });
};

exports.findInsuranceById = (id) => {
  return Insurance.findById(id);
};

exports.findAllInsurances = () => {
  return Insurance.find();
};

exports.deleteInsuranceById = (id) => {
  return Insurance.findByIdAndDelete(id);
};
