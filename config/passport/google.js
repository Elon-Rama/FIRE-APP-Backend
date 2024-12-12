// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const passport = require("passport");

// passport.use(
// 	new GoogleStrategy(
// 		{
// 			clientID: process.env.CLIENT_ID,
// 			clientSecret: process.env.CLIENT_SECRET,
// 			callbackURL: "http://localhost:7000/auth/google/callback",
// 			scope: ["profile", "email"],
// 		},
// 		function (accessToken, refreshToken, profile, callback) {
// 			console.log('Profile Data')
// 			console.log(profile)
// 			callback(null, profile);
// 		}
// 	)
// );

// passport.serializeUser((user, done) => {
// 	done(null, user);
// });

// passport.deserializeUser((user, done) => {
// 	done(null, user);
// });

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

// Configure the Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:7000/auth/google/callback", // Adjust as needed
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Profile Data:");
      console.log(profile);
      // Handle user logic (e.g., check user in DB or create new user)
      return done(null, profile);
    }
  )
);

// Serialize user (e.g., storing user ID in session)
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user (retrieve full user details using session data)
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
