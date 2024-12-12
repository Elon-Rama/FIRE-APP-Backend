const User = require("../../Models/Login/emailModel"); // Assuming a User model exists

exports.findUserById = async (userId) => {
  try {
    return await User.findById(userId); // Mongoose's `findById` returns a promise
  } catch (error) {
    throw new Error("Error fetching user from database");
  }
};
