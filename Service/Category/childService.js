const childExpensesDao = require("../../Dao/Category/childDao");

exports.upsert = async (expensesId, category, userId) => {
  try {
    const user = await childExpensesDao.findUserById(userId);
    if (!user) throw new Error("User not found");

    const expenses = await childExpensesDao.findExpensesById(expensesId);
    if (!expenses) throw new Error("Expenses ID does not exist");

    const result = await childExpensesDao.upsertSubCategory(
      expensesId,
      category,
      userId,
      expenses
    );
    return {
      statusCode: 201,
      message: "SubCategory updated/created successfully",
      data: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAll = async (userId) => {
  try {
    const user = await childExpensesDao.findUserById(userId);
    if (!user) throw new Error("User not found");

    return await childExpensesDao.findAllByUserId(userId);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getChildByMaster = async (userId, title) => {
  try {
    const subData = await childExpensesDao.findChildByMaster(userId, title);
    if (!subData) throw new Error("No Data found");

    return {
      statusCode: 200,
      message: "SubCategories data retrieved successfully",
      data: subData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.delete = async (id) => {
  try {
    const deletedExpense = await childExpensesDao.deleteById(id);
    if (!deletedExpense) throw new Error("ChildExpenses not found");

    return {
      statusCode: 200,
      message: "ChildExpenses deleted successfully",
      data: deletedExpense,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.search = async (searchTerm) => {
  try {
    const searchResult = await childExpensesDao.searchByCategory(searchTerm);
    return {
      statusCode: 200,
      message: "ChildExpenses retrieved successfully",
      data: searchResult,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
