const riskDao = require("../../Dao/PersonalRiskTolerance/riskDao");
const UserDAO = require("../../Dao/Login/emailDao");

const calculateRiskProfile = (totalScore) => {
    if (totalScore >= 6 && totalScore <= 10) {
      return "Conservative Risk Profile (Low risk tolerance)";
    } else if (totalScore >= 11 && totalScore <= 15) {
      return "Moderate Conservative Risk Profile";
    } else if (totalScore >= 16 && totalScore <= 20) {
      return "Balanced Risk Profile";
    } else if (totalScore >= 21 && totalScore <= 25) {
      return "Aggressive Risk Profile";
    } else {
      return "Very Aggressive Risk Profile (High risk tolerance)";
    }
  };
  
  exports.saveRiskProfile = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserDAO.findUserById(data.userId);
        if (!user) throw new Error("User not found");
  
        const { userId, answers } = data;
  
        if (!answers || !Array.isArray(answers)) {
          throw new Error("Answers must be provided as an array");
        }
        if (!answers.every((item) => item && item.answer)) {
          throw new Error("Each answer must have a valid 'answer' field");
        }
  
        let totalScore = 0;
        const processedAnswers = answers.map((item, index) => {
          const points =
            item.answer.toLowerCase() === "a"
              ? 1
              : item.answer.toLowerCase() === "b"
              ? 2
              : item.answer.toLowerCase() === "c"
              ? 3
              : 4;
          totalScore += points;
          return {
            question: index + 1,
            answer: item.answer,
            points,
          };
        });
  
        const riskProfile = calculateRiskProfile(totalScore);
  
        const riskData = {
          userId,
          answers: processedAnswers,
          totalScore,
          riskProfile,
        };
  
        await riskDao.createRisk(riskData);
  
        resolve({
          statusCode: "0",
          message: "Personal Risk Tolerance created successfully",
          userId,
          data: riskData,
        });
      } catch (error) {
        reject({
          statusCode: "1",
          message: "An error occurred",
          error: error.message,
        });
      }
    });
  };
  

// exports.getRiskProfile = (userId) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const riskData = await riskDao.findUserById({ userId })
//         .sort({ createdAt: -1 })
//         .limit(1);

//       if (!riskData || riskData.length === 0) {
//         return reject({
//           statusCode: "1",
//           message: "No risk profile found for this user",
//         });
//       }

//       const latestRiskData = riskData[0];

//       resolve({
//         statusCode: "0",
//         message: "Data retrieved successfully",
//         userId: latestRiskData.userId,
//         data: latestRiskData.answers,
//         totalScore: latestRiskData.totalScore,
//         status: latestRiskData.riskProfile,
//       });
//     } catch (error) {
//       reject({
//         statusCode: "1",
//         message: "An error occurred",
//         error: error.message,
//       });
//     }
//   });
// };

exports.getRiskProfile = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const riskData = await riskDao.findLatestRiskProfile(userId); // Use the new method
      if (!riskData) {
        return reject({
          statusCode: "1",
          message: "No risk profile found for this user",
        });
      }

      resolve({
        statusCode: "0",
        message: "Data retrieved successfully",
        userId: riskData.userId,
        data: riskData.answers,
        totalScore: riskData.totalScore,
        status: riskData.riskProfile,
      });
    } catch (error) {
      reject({
        statusCode: "1",
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};
