const emailService = require("../../Service/Login/emailService");

exports.signIn = (req, res) => {
  //#swagger.tags = ['Login-User']
  const { email } = req.body;

  if (!email) {
    return res.status(200).json({ error: "Email is required" });
  }

  emailService
    .signIn(email)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to sign in" });
    });
};

exports.verifyOTP = (req, res) => {
  //#swagger.tags = ['Login-User']
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  emailService
    .verifyOTP(email, otp)
    .then((response) => {
      if (response.error) {
        return res.status(400).json(response);
      }
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to verify OTP" });
    });
};

exports.logout = (req, res) => {
  //#swagger.tags = ['Login-User']
  const { userId } = req.body;

  if (!userId) {
    return res.status(200).json({ error: "User ID is required" });
  }

  emailService
    .logout(userId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to log out" });
    });
};

// Validate Token
exports.Validate = (req, res) => {
  //#swagger.tags = ['Login-User']
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(200).json({ error: "Email and token are required" });
  }

  emailService
    .validateToken(email, token)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to validate token" });
    });
};

// Check Session
exports.checkSession = (req, res) => {
  //#swagger.tags = ['Login-User']
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  emailService
    .checkSession(sessionId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to check session" });
    });
};

// Refresh Token
exports.refreshToken = (req, res) => {
  //#swagger.tags = ['Login-User']
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  emailService
    .refreshToken(token)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to refresh token" });
    });
};
