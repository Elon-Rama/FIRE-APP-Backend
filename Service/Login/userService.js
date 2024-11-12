const userDao = require("../../Dao/Login/userDao");

exports.createUserProfile = async (userId, profileData) => {
  const existingUser = await userDao.findUserById(userId);
  if (!existingUser) {
    return Promise.reject({
      status: 400,
      message: "User not found. User profile cannot be created.",
    });
  }
  return await userDao.createProfile(profileData);
};

exports.getUserProfileById = async (profileId) => {
  const profile = await userDao.findProfileById(profileId);
  if (!profile) {
    return Promise.reject({ status: 404, message: "UserProfile not found" });
  }
  return profile;
};

exports.deleteUserProfileById = async (profileId) => {
  const profile = await userDao.findProfileById(profileId);
  if (!profile) {
    return Promise.reject({
      status: 404,
      message: "No userProfile data found",
    });
  }
  return await userDao.deleteProfileById(profileId);
};

exports.getAllUserProfiles = () => {
  return userDao.getAllProfiles();
};

exports.updateUserProfileById = async (profileId, updateData) => {
  const updatedProfile = await userDao.updateProfileById(profileId, updateData);
  if (!updatedProfile) {
    return Promise.reject({
      status: 404,
      message: "User profile not found. Cannot update.",
    });
  }
  return updatedProfile;
};
