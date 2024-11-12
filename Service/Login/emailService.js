const emailDao = require("../../Dao/Login/emailDao");
const nodemailer = require("nodemailer");
const Cryptr = require("cryptr");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const ExpensesMaster = require("../../Models/Category/masterModel");
const ChildExpenses = require("../../Models/Category/childModel");
const ExpensesAllocation = require("../../Models/ExpensesAllocation/allocationModel");
const Profile = require("../../Models/Login/userModel");
const User = require("../../Models/Login/emailModel");

const cryptr = new Cryptr(process.env.JWT_SECRET);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

exports.signIn = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await emailDao.findUserByEmail(email);
      if (!user) {
        user = await emailDao.createUser(email);
      }

      if (user.loggedIn) {
        return resolve({ error: "User is already logged in" });
      }

      const otp = generateOTP();
      const encryptedOtp = cryptr.encrypt(otp);

      await emailDao.updateOtpAndStatus(user._id, encryptedOtp, false);

      const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject("Failed to send OTP email");
        }
        resolve({
          success: true,
          message: "OTP sent to email",
          userId: user._id,
        });
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.verifyOTP = (email, otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return resolve({ error: "User not found" });
      }

      if (user.loggedIn) {
        return resolve({ error: "User is already logged in" });
      }

      const decryptedOtp = cryptr.decrypt(user.otp);
      if (decryptedOtp !== otp) {
        return resolve({ error: "Invalid OTP" });
      }

      const sessionId = uuidv4();
      const sessionExpiresAt = Date.now() + 59 * 60 * 1000; // 59 minutes
      const token = generateToken(user.email, user._id);

      user.loggedIn = true;
      user.otp = null;
      user.token = token;
      user.sessionId = sessionId;
      user.sessionExpiresAt = sessionExpiresAt;
      await user.save();

      // Create default expenses if none exist
      await createDefaultExpenses(user._id);

      // Optionally fetch the user profile
      const userProfile = await Profile.findOne({ userId: user._id });

      resolve({
        success: true,
        message: "OTP is valid, user logged in, and default expenses created",
        token,
        sessionId,
        sessionExpiresAt,
        loggedIn: user.loggedIn,
        userId: user._id,
        userProfile: !!userProfile,
      });
    } catch (err) {
      reject(err);
    }
  });
};

// Create default expenses in a separate function
const createDefaultExpenses = async (userId) => {
  const existingExpenses = await ExpensesMaster.findOne({ userId });

  if (!existingExpenses) {
    const defaultExpenses = [
      {
        title: "Housing",
        active: true,
        userId: userId,
        category: [
          { title: "Rent", amount: 0 },
          { title: "Mortgage", amount: 0 },
          { title: "Utilities", amount: 0 },
          { title: "Phone", amount: 0 },
          { title: "Gas", amount: 0 },
        ],
      },
      {
        title: "Entertainment",
        active: true,
        userId: userId,
        category: [
          { title: "Movies", amount: 0 },
          { title: "Music", amount: 0 },
          { title: "Events", amount: 0 },
        ],
      },
      {
        title: "Transportation",
        active: true,
        userId: userId,
        category: [
          { title: "Car", amount: 0 },
          { title: "Fuel", amount: 0 },
          { title: "Public Transport", amount: 0 },
        ],
      },
      {
        title: "Loans",
        active: true,
        userId: userId,
        category: [
          { title: "Personal Loan", amount: 0 },
          { title: "Car Loan", amount: 0 },
          { title: "Student Loan", amount: 0 },
        ],
      },
      {
        title: "Insurance",
        active: true,
        userId: userId,
        category: [
          { title: "Health Insurance", amount: 0 },
          { title: "Car Insurance", amount: 0 },
          { title: "Life Insurance", amount: 0 },
        ],
      },
    ];

    const createdMasterExpenses = await ExpensesMaster.insertMany(defaultExpenses);

    const subcategoriesMapping = [
      {
        title: "Housing",
        expensesId: createdMasterExpenses[0]._id,
        category: ["Rent", "Mortgage", "Utilities", "Phone", "Gas"],
        active: true,
        userId: userId,
      },
      {
        title: "Entertainment",
        expensesId: createdMasterExpenses[1]._id,
        category: ["Movies", "Music", "Events"],
        active: true,
        userId: userId,
      },
      {
        title: "Transportation",
        expensesId: createdMasterExpenses[2]._id,
        category: ["Car", "Fuel", "Public Transport"],
        active: true,
        userId: userId,
      },
      {
        title: "Loans",
        expensesId: createdMasterExpenses[3]._id,
        category: ["Personal Loan", "Car Loan", "Student Loan"],
        active: true,
        userId: userId,
      },
      {
        title: "Insurance",
        expensesId: createdMasterExpenses[4]._id,
        category: ["Health Insurance", "Car Insurance", "Life Insurance"],
        active: true,
        userId: userId,
      },
    ];

    await ChildExpenses.insertMany(subcategoriesMapping);

    const currentMonth = new Date().getMonth() + 1; // use number format
    const currentYear = new Date().getFullYear();

    const expensesTitles = createdMasterExpenses.map((expense) => ({
      title: expense.title,
      active: expense.active,
      category: expense.category,
      amount: 0,
    }));

    const newExpensesAllocation = new ExpensesAllocation({
      userId,
      month: currentMonth,
      year: currentYear,
      titles: expensesTitles,
    });

    await newExpensesAllocation.save();
  }
};

exports.logout = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await emailDao.findUserById(userId);
      if (!user) return resolve({ error: "User not found" });

      await emailDao.logoutUser(userId);
      resolve({ success: true, message: "User logged out successfully" });
    } catch (err) {
      reject(err);
    }
  });
};

// Validate Token Service
exports.validateToken = (email, token) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.email !== email) {
        return reject({ error: "Invalid token or email" });
      }
      User.findOne({ email }).then((user) => {
        if (!user) {
          return reject({ error: "User not found" });
        }
        resolve({ success: true, message: "Valid email and token" });
      });
    } catch (err) {
      reject({ error: "Invalid token" });
    }
  });
};

// Check Session Service
exports.checkSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    User.findOne({ sessionId })
      .then((user) => {
        if (!user) {
          return reject({ error: "Invalid session ID" });
        }
        if (Date.now() > user.sessionExpiresAt) {
          user.loggedIn = false;
          user.sessionId = null;
          user.save().then(() => {
            return reject({ error: "Session expired. Please log in again." });
          });
        } else {
          resolve({ success: true, message: "Session is active" });
        }
      })
      .catch((err) => reject({ error: "Failed to check session" }));
  });
};

// Refresh Token Service
exports.refreshToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const newToken = jwt.sign(
        { email: decoded.email, userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      resolve({ success: true, token: newToken });
    } catch (err) {
      reject({ error: "Invalid or expired token" });
    }
  });
};
