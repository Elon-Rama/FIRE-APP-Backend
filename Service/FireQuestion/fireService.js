const fireDao = require("../../Dao/FireQuestion/fireDao");
const UserDAO = require("../../Dao/Login/emailDao");

const formatNumberWithCommas = (number) => {
  const numStr = number.toString();
  const [integerPart, decimalPart] = numStr.split(".");
  const lastThreeDigits = integerPart.slice(-3);
  const otherDigits = integerPart
    .slice(0, -3)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const formattedInteger = otherDigits
    ? `${otherDigits},${lastThreeDigits}`
    : lastThreeDigits;
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

exports.create = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserDAO.findUserById(data.userId);

      if (!user) {
        return reject({ error: "User not found" });
      }
      const fireQuestionData = await fireDao.create(data);
      fireQuestionData.expense = formatNumberWithCommas(
        fireQuestionData.expense
      );
      fireQuestionData.monthlysavings = formatNumberWithCommas(
        fireQuestionData.monthlysavings
      );
      fireQuestionData.retirementsavings = formatNumberWithCommas(
        fireQuestionData.retirementsavings
      );

      resolve({
        success: true,
        message: "FireQuestion created successfully",
        fireId: fireQuestionData._id,
        fireQuestionData,
      });
    } catch (err) {
      reject({ error: err.message || "Failed to create FireQuestion" });
    }
  });
};

exports.calculate = (fireId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fireQuestionData = await fireDao.findFireQuestionById(fireId);

      if (!fireQuestionData) {
        return resolve({
          status: 200,
          data: {
            success: false,
            message: "FireQuestion not found for the user.",
          },
        });
      }

      const {
        age,
        retireage,
        expense,
        inflation,
        monthlysavings,
        retirementsavings,
        prereturn,
        postreturn,
        expectancy,
      } = fireQuestionData;

      const yearsToRetirement = retireage - age;
      const postRetirementYears = expectancy - retireage;
      const adjustedExpense =
        expense * Math.pow(1 + inflation / 100, yearsToRetirement);
      const targetSavings = adjustedExpense * 12 * postRetirementYears;
      const savingsAtRetirement =
        retirementsavings * Math.pow(1 + prereturn / 100, yearsToRetirement);

      const monthlyRate = prereturn / 100 / 12;
      const monthsToRetirement = yearsToRetirement * 12;
      const accumulatedSavingsFromMonthly =
        monthlysavings *
        ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);

      const totalSavingsAtRetirement =
        savingsAtRetirement + accumulatedSavingsFromMonthly;
      const savingsShortfall = targetSavings - totalSavingsAtRetirement;

      const extraOneTimeSavings = savingsShortfall > 0 ? savingsShortfall : 0;
      const extraMonthlySavings =
        extraOneTimeSavings > 0
          ? (extraOneTimeSavings * monthlyRate) /
            (Math.pow(1 + monthlyRate, monthsToRetirement) - 1)
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

      await fireDao.updateFireQuestionWithCalculation(fireId, results);

      const formattedResults = Object.fromEntries(
        Object.entries(results).map(([key, value]) => [
          key,
          formatNumberWithCommas(value),
        ])
      );

      resolve({
        status: 201,
        data: {
          success: true,
          message: "Retirement calculation successfully",
          data: formattedResults,
        },
      });
    } catch (error) {
      reject({
        status: 500,
        data: {
          success: false,
          message: "Error during retirement calculation",
          error: error.message,
        },
      });
    }
  });
};
