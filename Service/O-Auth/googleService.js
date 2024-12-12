const googleDao = require("../../Dao/O-Auth/googleDao");

exports.getGoogleLogoutUrl = () => {
  return `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${process.env.CLIENT_URL1}`;
};

exports.handleLogout = async (req) => {
  return new Promise((resolve, reject) => {
    req.logout((err) => {
      if (err) return reject(new Error("Error logging out"));
      req.session = null;
      resolve();
    });
  });
};
