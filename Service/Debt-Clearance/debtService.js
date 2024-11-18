const moment = require("moment-timezone");
const debtDao = require('../../Dao/Debt-Clearance/debtDao');
const User = require("../../Models/Login/emailModel");

const calculateLoanData = (amount, rateOfInterest, EMI) => {
  const totalInterest = (amount * rateOfInterest) / 100;
  const debtAmount = amount + totalInterest;
  const totalMonths = Math.ceil(debtAmount / EMI);

  const years = Math.floor(totalMonths / 12);
  const extraMonths = totalMonths % 12;
  const yearstorepaid = `${years} years ${extraMonths} months`;

  return { debtAmount, yearstorepaid, totalMonths };
};

const processLoans = async (userId, source) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Process loans
  let totalMonths = 0;
  const processedLoans = source.map((loan) => {
    const { debtAmount, yearstorepaid, totalMonths: loanMonths } = calculateLoanData(
      parseFloat(loan.amount),
      loan.RateofInterest,
      loan.EMI
    );

    totalMonths += loanMonths;

    return {
      ...loan,
      amount: parseFloat(loan.amount),
      debtAmount: debtAmount.toFixed(2),
      yearstorepaid,
      RemainingBalance: debtAmount.toFixed(2),
    };
  });

  return { processedLoans, totalMonths };
};

exports.createDebt = async (userId, source) => {
  const existingDebt = await debtDao.findDebtByUserId(userId);

  let totalMonths = 0;
  const { processedLoans } = await processLoans(userId, source);

  if (existingDebt) {
    // Update existing debt
    existingDebt.source = [...existingDebt.source, ...processedLoans];

    const updatedDebtAmount = existingDebt.source.reduce(
      (sum, loan) => sum + parseFloat(loan.debtAmount),
      0
    );

    const updatedRemainingBalance = existingDebt.source.reduce(
      (sum, loan) => sum + parseFloat(loan.RemainingBalance),
      0
    );

    existingDebt.debtAmount = updatedDebtAmount.toFixed(2);
    existingDebt.RemainingBalance = updatedRemainingBalance.toFixed(2);
    await debtDao.updateDebt(existingDebt);

    return existingDebt;
  } else {
    // Create new debt record
    const debtData = { userId, source: processedLoans };
    const savedDebt = await debtDao.saveDebt(debtData);
    return savedDebt;
  }
};

exports.getAllDebts = async (userId) => {
  const debts = await debtDao.findDebtByUserId(userId);
  if (!debts) throw new Error('No debt records found for this user');

  const totalDebt = debts.source.reduce(
    (sum, loan) => sum + parseFloat(loan.debtAmount),
    0
  );

  const totalMonths = debts.source.reduce(
    (sum, loan) =>
      sum +
      calculateLoanData(parseFloat(loan.amount), loan.RateofInterest, loan.EMI)
        .totalMonths,
    0
  );

  const consolidatedYearstorepaid = `${Math.floor(totalMonths / 12)} years ${
    totalMonths % 12
  } months`;

  return {
    ...debts._doc,
    TotalDebt: totalDebt.toFixed(2),
    yearstorepaid: consolidatedYearstorepaid,
  };
};


