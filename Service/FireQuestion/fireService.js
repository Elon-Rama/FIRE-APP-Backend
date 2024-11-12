const FireDAO = require("../../Dao/FireQuestion/fireDao");
const UserDAO = require("../../Dao/Login/emailDao");

const formatNumberWithCommas = (number) => {
  const numStr = number.toString();
  const [integerPart, decimalPart] = numStr.split(".");
  const lastThreeDigits = integerPart.slice(-3);
  const otherDigits = integerPart
    .slice(0, -3)
    .replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const formattedInteger = otherDigits
    ? `${otherDigits},${lastThreeDigits}`
    : lastThreeDigits;
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

exports.createFireQuestion = async (data) => {
  const {
    userId,
    occupation,
    city,
    age,
    retireage,
    expense,
    inflation,
    monthlysavings,
    retirementsavings,
    prereturn,
    postreturn,
    expectancy,
  } = data;

  const requiredFields = [
    userId,
    occupation,
    city,
    age,
    retireage,
    expense,
    inflation,
    monthlysavings,
    retirementsavings,
    prereturn,
    postreturn,
    expectancy,
  ];

  if (requiredFields.includes(undefined)) {
    return {
      status: 400,
      data: {
        success: false,
        message: "All fields are required",
      },
    };
  }

  const existingUser = await UserDAO.findUserById(userId);
  if (!existingUser) {
    return {
      status: 400,
      data: {
        success: false,
        message: "User not found. FireQuestion cannot be created.",
      },
    };
  }

  const fireQuestionData = await FireDAO.createFireQuestion(data);

  fireQuestionData.expense = formatNumberWithCommas(fireQuestionData.expense);
  fireQuestionData.monthlysavings = formatNumberWithCommas(fireQuestionData.monthlysavings);
  fireQuestionData.retirementsavings = formatNumberWithCommas(fireQuestionData.retirementsavings);

  return {
    status: 201,
    data: {
      success: true,
      message: "FireQuestion created successfully",
      fireId: fireQuestionData._id,
      fireQuestionData,
    },
  };
};

exports.calculateRetirement = async (fireId) => {
  const fireQuestionData = await FireDAO.findFireQuestionById(fireId);
  if (!fireQuestionData) {
    return {
      status: 404,
      data: {
        success: false,
        message: "FireQuestion not found for the user.",
      },
    };
  }

  // Calculations
  const { age, retireage, expense, inflation, monthlysavings, retirementsavings, prereturn, postreturn, expectancy } = fireQuestionData;
  const yearsToRetirement = retireage - age;
  const postRetirementYears = expectancy - retireage;
  const adjustedExpense = expense * Math.pow(1 + inflation / 100, yearsToRetirement);
  const targetSavings = adjustedExpense * 12 * postRetirementYears;
  const savingsAtRetirement = retirementsavings * Math.pow(1 + prereturn / 100, yearsToRetirement);

  const monthlyRate = prereturn / 100 / 12;
  const monthsToRetirement = yearsToRetirement * 12;
  const accumulatedSavingsFromMonthly = monthlysavings * ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);

  const totalSavingsAtRetirement = savingsAtRetirement + accumulatedSavingsFromMonthly;
  const savingsShortfall = targetSavings - totalSavingsAtRetirement;

  const extraOneTimeSavings = savingsShortfall > 0 ? savingsShortfall : 0;
  const extraMonthlySavings = extraOneTimeSavings > 0
    ? (extraOneTimeSavings * monthlyRate) / (Math.pow(1 + monthlyRate, monthsToRetirement) - 1)
    : 0;

  const results = {
    yearsLeftForRetirement: Math.round(yearsToRetirement),
    monthlyExpensesAfterRetirement: Math.round(adjustedExpense),
    targetedSavings: Math.round(targetSavings),
    totalSavingsAtRetirement: Math.round(totalSavingsAtRetirement),
    accumulatedSavings: Math.round(accumulatedSavingsFromMonthly),
    shortfallInSavings: Math.round(savingsShortfall),
    existingSavingsGrowth: Math.round(savingsAtRetirement),
    extraOneTimeSavingsRequired: Math.round(extraOneTimeSavings),
    extraMonthlySavingsRequired: Math.round(extraMonthlySavings),
  };

  await FireDAO.updateFireQuestionWithCalculation(fireId, results);

  // Format numbers
  const formattedResults = Object.fromEntries(
    Object.entries(results).map(([key, value]) => [key, formatNumberWithCommas(value)])
  );

  return {
    status: 200,
    data: {
      success: true,
      message: "Retirement calculation successful and data saved",
      data: formattedResults,
    },
  };
};
