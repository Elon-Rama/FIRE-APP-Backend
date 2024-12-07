const debtDao = require("../../Dao/Debt-Clearance/debtDao");
const moment = require("moment-timezone");

exports.createOrUpdateDebt = async (userId, source) => {
  const currentDateTime = moment.tz("Asia/Kolkata");
  const currentDate = currentDateTime.format("YYYY-MM-DD");
  const currentTime = currentDateTime.format("HH:mm:ss");

  const enrichedSource = source.map((loan) => {
    const monthlyInterestRate = loan.interest / 100 / 12;
    const totalMonths = loan.loanTenure * 12;

    const emi =
      (loan.principalAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

    const totalPayment = emi * totalMonths;
    const totalInterestPayment = totalPayment - loan.principalAmount;
    const outstandingBalance = loan.principalAmount - loan.currentPaid;

    return {
      ...loan,
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterestPayment: Math.round(totalInterestPayment),
      outstandingBalance: Math.round(outstandingBalance),
      date: currentDate,
      time: currentTime,
      paymentHistory: [],
    };
  });

  return debtDao.upsertDebt(userId, enrichedSource);
};

exports.getAllDebts = async (userId) => {
  const debt = await debtDao.getDebtByUserId(userId);
  if (!debt) {
    throw new Error("No debt clearance records found for the user.");
  }

  let totalDebt = 0,
    totalInterest = 0,
    totalPaid = 0,
    totalOwed = 0;

  debt.source.forEach((loan) => {
    totalDebt += loan.principalAmount;
    totalInterest += loan.totalInterestPayment;
    totalPaid += loan.currentPaid;
    totalOwed += loan.totalPayment - loan.currentPaid;

    let currentBalance = loan.principalAmount;
    loan.paymentHistory.forEach((payment) => {
      currentBalance -= payment.principalPaid;
      payment.remainingBalance = Math.max(0, currentBalance);
    });
  });

  return {
    statusCode: "0",
    message: "Debt clearance records fetched successfully.",
    userId: debt.userId,
    debtId: debt._id,
    data: [
      {
        source: debt.source,
        summary: {
          TotalDebt: Math.round(totalDebt),
          TotalInterest: Math.round(totalInterest),
          TotalPaid: Math.round(totalPaid),
          TotalOwed: Math.round(totalOwed),
        },
      },
    ],
  };
};

exports.payEMI = async (userId, loanId, emiPaid) => {
  const debt = await debtDao.getDebtByUserId(userId);
  if (!debt) {
    throw new Error("Debt record not found.");
  }

  const loan = debt.source.find((loan) => loan._id.toString() === loanId);
  if (!loan) {
    throw new Error("Loan not found.");
  }

  const monthlyInterestRate = loan.interest / 100 / 12;
  const interestForTheMonth = loan.outstandingBalance * monthlyInterestRate;

  if (emiPaid < interestForTheMonth) {
    throw new Error("EMI is too low to cover interest.");
  }

  const principalPaid = emiPaid - interestForTheMonth;

  loan.currentPaid += emiPaid;
  const currentDateTime = moment.tz("Asia/Kolkata");
  const currentMonth = currentDateTime.format("YYYY-MM");

  loan.paymentHistory.push({
    month: currentMonth,
    emiPaid,
    principalPaid: Math.round(principalPaid),
    interestPaid: Math.round(interestForTheMonth),
    remainingBalance: Math.round(loan.outstandingBalance),
  });

  loan.outstandingBalance = Math.round(loan.outstandingBalance - principalPaid);

  await debt.save();

  return {
    message: "EMI payment recorded successfully.",
    data: {
      loanId: loan._id,
      emiPaid,
      interestPaid: Math.round(interestForTheMonth),
      principalPaid: Math.round(principalPaid),
      currentPaid: loan.currentPaid,
      outstandingBalance: Math.round(loan.outstandingBalance),
    },
  };
};
