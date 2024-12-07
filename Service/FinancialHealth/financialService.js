const financialDao = require("../../Dao/FinancialHealth/financialDao");
const UserDAO = require("../../Dao/Login/emailDao");

exports.createFinancialData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserDAO.findUserById(data.userId);
      if (!user) {
        return reject({ error: "User not found" });
      }

      const financialData = {
        userId: data.userId,
        income: data.income,
        expenses: data.expenses,
        debtAmount: data.debtAmount,
        monthlyEmi: data.monthlyEmi,
        insurance: data.insurance,
        emergencyFund: data.emergencyFund,
        investments: data.investments,
      };

      const savedRecord = await financialDao.createFinancialData(financialData);

      resolve({
        message: "Financial health record created successfully",
        data: savedRecord,
      });
    } catch (error) {
      console.error("Error creating financial record:", error);

      reject({ error: "Internal server error" });
    }
  });
};

exports.getUserFinancial = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserDAO.findUserById(userId);
      if (!user) {
        return reject({ error: "User not found" });
      }

      const userData = await financialDao.getUserFinancial(userId);
      if (!userData) {
        return resolve({ error: "Financial data not found for this user" });
      }

      const {
        income = 0,
        expenses = 0,
        debtAmount = 0,
        monthlyEmi = 0,
        emergencyFund = 0,
        insurance = "None",
        investments = [],
      } = userData;

      let savingsRate = 0;
      let savingsScore = { status: "Poor", points: 0 };

      if (income > 0) {
        savingsRate = ((income - expenses) / income) * 100;

        if (savingsRate < 10) {
          savingsScore = { status: "Needs Improvement", points: 25 };
        } else if (savingsRate >= 10 && savingsRate < 20) {
          savingsScore = { status: "Fair", points: 50 };
        } else if (savingsRate >= 20 && savingsRate < 30) {
          savingsScore = { status: "Good", points: 73 };
        } else {
          savingsScore = { status: "Excellent", points: 100 };
        }
      }

      const debtToIncomeRatio = income > 0 ? (monthlyEmi / income) * 100 : 0;
      const debtScore =
        debtToIncomeRatio > 50
          ? { status: "Poor", points: 25 }
          : debtToIncomeRatio >= 30
          ? { status: "Fair", points: 50 }
          : debtToIncomeRatio >= 10
          ? { status: "Good", points: 75 }
          : { status: "Excellent", points: 82 };

      const emergencyMonths = expenses ? emergencyFund / expenses : 0;
      const emergencyFundScore =
        emergencyMonths < 1
          ? { status: "Poor", points: 15 }
          : emergencyMonths < 3
          ? { status: "Needs Improvement", points: 43 }
          : emergencyMonths < 6
          ? { status: "Good", points: 70 }
          : { status: "Excellent", points: 100 };

      const hasHealth = insurance.includes("Health");
      const hasTerms = insurance.includes("Terms");
      const hasBoth = insurance.includes("Both");

      const insuranceScore = hasBoth
        ? { status: "Excellent", points: 100 }
        : hasHealth || hasTerms
        ? { status: "Fair", points: 50 }
        : { status: "Poor", points: 0 };

      const uniqueInvestments = [...new Set(investments)];
      const investmentScore =
        uniqueInvestments.length < 3
          ? { status: "Poor", points: 10 }
          : uniqueInvestments.length === 3
          ? { status: "Fair", points: 50 }
          : { status: "Excellent", points: 100 };

      const finalScore =
        savingsScore.points * 0.3 +
        debtScore.points * 0.2 +
        emergencyFundScore.points * 0.2 +
        insuranceScore.points * 0.15 +
        investmentScore.points * 0.15;

      const overallStatus =
        finalScore >= 81
          ? "Excellent"
          : finalScore >= 61
          ? "Good"
          : finalScore >= 41
          ? "Fair"
          : "Poor";

      const description =
        overallStatus === "Excellent"
          ? "Strong financial position with all metrics in check."
          : overallStatus === "Good"
          ? "Overall solid financial position."
          : overallStatus === "Fair"
          ? "Needs improvement; some metrics are healthy, others need attention."
          : "Financial health is weak; significant attention needed.";

      const improvementRecommendations = [];
      if (savingsScore.points < 50)
        improvementRecommendations.push("Savings Rate");
      if (debtScore.points < 50)
        improvementRecommendations.push("Debt-to-Income Ratio");
      if (emergencyFundScore.points < 50)
        improvementRecommendations.push("Emergency Fund Adequacy");
      if (insuranceScore.points < 50)
        improvementRecommendations.push("Insurance Coverage");
      if (investmentScore.points < 50)
        improvementRecommendations.push("Investment Diversification");

      userData.savingsScore = savingsScore;
      userData.debtScore = debtScore;
      userData.emergencyFundScore = emergencyFundScore;
      userData.insuranceScore = insuranceScore;
      userData.investmentScore = investmentScore;
      userData.finalScore = finalScore;
      userData.overallStatus = overallStatus;
      userData.description = description;

      await userData.save();

      resolve({
        message: "Financial health data retrieved successfully",
        data: {
          metrics: [
            {
              metric: "Savings Rate",
              value: savingsRate.toFixed(2),
              status: savingsScore.status,
              points: savingsScore.points,
            },
            {
              metric: "Debt-to-Income Ratio",
              value: debtToIncomeRatio.toFixed(2),
              status: debtScore.status,
              points: debtScore.points,
            },
            {
              metric: "Emergency Fund Adequacy",
              value: emergencyMonths.toFixed(2),
              status: emergencyFundScore.status,
              points: emergencyFundScore.points,
            },
            {
              metric: "Insurance Coverage",
              status: insuranceScore.status,
              points: insuranceScore.points,
            },
            {
              metric: "Investment Diversification",
              status: investmentScore.status,
              points: investmentScore.points,
            },
            {
              metric: "Overall Score",
              value: finalScore.toFixed(2),
              status: overallStatus,
              description,
              recommendation:
                improvementRecommendations.join(", ") ||
                "No improvement needed.",
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error retrieving or updating financial record:", error);
      reject({ error: "Internal server error" });
    }
  });
};
