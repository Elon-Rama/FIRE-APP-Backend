const Profile = require("../../Models/Login/userModel");
const User = require("../../Models/Login/emailModel");

exports.findUserById = (userId) => {
  return User.findById(userId).exec();
};

exports.createProfile = (profileData) => {
  const profile = new Profile(profileData);
  return profile.save();
};

exports.findProfileById = (profileId) => {
  return Profile.findById(profileId).exec();
};

exports.deleteProfileById = (profileId) => {
  return Profile.deleteOne({ _id: profileId }).exec();
};

exports.getAllProfiles = () => {
  return Profile.find().exec();
};

exports.updateProfileById = (profileId, updateData) => {
  return Profile.findByIdAndUpdate(profileId, updateData, {
    new: true,
    runValidators: true,
  }).exec();
};
