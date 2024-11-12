const userService = require("../../Service/Login/userService");

exports.create = (req, res) => {
  const { userId, name, dob, gender, contactNumber, interestedInFhir } =
    req.body;
  const profileData = {
    userId,
    name,
    dob,
    gender,
    contactNumber,
    interestedInFhir,
  };

  userService
    .createUserProfile(userId, profileData)
    .then((userProfile) => {
      res.status(201).json({
        success: true,
        message: "User profile created successfully",
        userProfile,
      });
    })
    .catch((error) => {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error creating user profile",
      });
    });
};

exports.getById = (req, res) => {
  userService
    .getUserProfileById(req.params.profile_id)
    .then((profile) => {
      res.status(200).json({
        statusCode: "0",
        message: "UserProfile retrieved successfully",
        data: profile,
      });
    })
    .catch((error) => {
      res.status(error.status || 500).json({
        statusCode: "1",
        message: error.message || "Failed to retrieve userProfile data",
      });
    });
};

exports.deleteById = (req, res) => {
  userService
    .deleteUserProfileById(req.params.profile_id)
    .then(() => {
      res.status(200).json({
        statusCode: "0",
        message: "UserProfile data deleted successfully",
      });
    })
    .catch((error) => {
      res.status(error.status || 500).json({
        statusCode: "1",
        message: error.message || "Failed to delete userProfile",
      });
    });
};

exports.getAll = (req, res) => {
  userService
    .getAllUserProfiles()
    .then((profiles) => {
      res.status(200).json({
        statusCode: "0",
        message: "UserProfile data retrieved successfully",
        data: profiles,
      });
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: "1",
        message: "Failed to retrieve userProfile data",
      });
    });
};

exports.update = (req, res) => {
  const updateData = req.body;

  userService
    .updateUserProfileById(req.params.profile_id, updateData)
    .then((updatedProfile) => {
      res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        userProfile: updatedProfile,
      });
    })
    .catch((error) => {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error updating user profile",
      });
    });
};
