const googleService = require("../../Service/O-Auth/googleService");


exports.loginSuccess = async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({
        error: false,
        message: "Successfully Logged In",
        user: req.user,
      });
    } else {
      res.status(403).json({ error: true, message: "Not Authorized" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.loginFailed = async (req, res) => {
  try {
    res.status(401).json({
      error: true,
      message: "Log in failure",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await authService.handleLogout(req);
    const logoutURL = authService.getGoogleLogoutUrl();
    res.redirect(logoutURL);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
