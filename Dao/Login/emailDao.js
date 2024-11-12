const User = require("../../Models/Login/emailModel");

exports.findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error("Error finding user by email");
  }
};

exports.createUser = async (email) => {
  try {
    const newUser = new User({
      email,
      loggedIn: false,
      otp: null,
      sessionId: null,
      sessionExpiresAt: null,
    });
    return await newUser.save();
  } catch (error) {
    throw new Error("Error creating new user");
  }
};

exports.updateOtpAndStatus = async (userId, otp, loggedIn) => {
  try {
    return await User.findByIdAndUpdate(
      userId,
      { otp, loggedIn },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error updating OTP and status");
  }
};

exports.updateSessionAndClearOtp = async (userId, sessionId, token) => {
  const expiresIn = 59 * 60 * 1000;
  const sessionExpiresAt = new Date(Date.now() + expiresIn);

  try {
    await User.findByIdAndUpdate(userId, {
      sessionId: sessionId,
      token: token,
      loggedIn: true,
      otp: null,
      sessionExpiresAt: sessionExpiresAt,
    });
    return true;
  } catch (err) {
    throw new Error("Failed to update session and clear OTP");
  }
};

exports.findUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    throw new Error("Error finding user by ID");
  }
};

exports.updateSession = async (userId, sessionId, token, loggedIn) => {
  try {
    return await User.findByIdAndUpdate(
      userId,
      { sessionId, token, loggedIn, sessionExpiresAt: Date.now() + 3600000 },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error updating session information");
  }
};

exports.logoutUser = async (userId) => {
  try {
    return await User.findByIdAndUpdate(
      userId,
      { loggedIn: false, sessionId: null },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error logging out user");
  }
};

exports.validateToken = async (email, token) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.token !== token) {
      throw new Error("Invalid token");
    }
    return user;
  } catch (error) {
    throw new Error("Error validating token");
  }
};

exports.checkSession = async (sessionId) => {
  try {
    const user = await User.findOne({ sessionId });
    if (!user) {
      throw new Error("Invalid session ID");
    }

    if (Date.now() > user.sessionExpiresAt) {
      await User.findByIdAndUpdate(user._id, {
        loggedIn: false,
        sessionId: null,
      });
      throw new Error("Session expired. Please log in again.");
    }
    return user;
  } catch (error) {
    throw new Error("Error checking session");
  }
};

exports.refreshToken = async (userId, newToken) => {
  try {
    return await User.findByIdAndUpdate(
      userId,
      { token: newToken },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error refreshing token");
  }
};
