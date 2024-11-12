const insuranceDao = require("../../Dao/Insurance/insuranceDao");

exports.addInsurance = (data) => {
  return insuranceDao
    .users(data.userId)
    .then((userExists) => {
      if (!userExists) {
        throw new Error("User not found");
      }

      return insuranceDao.createInsurance(data);
    })
    .catch((error) => {
      throw error;
    });
};

exports.updateInsurance = (id, updateData) => {
  return insuranceDao.updateInsuranceById(id, updateData);
};

exports.getInsuranceById = (id) => {
  return insuranceDao.findInsuranceById(id);
};

exports.getAllInsurances = () => {
  return insuranceDao.findAllInsurances();
};

exports.deleteInsurance = (id) => {
  return insuranceDao.deleteInsuranceById(id);
};
