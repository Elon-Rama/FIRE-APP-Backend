const express = require("express");
const api = express.Router();

const emailRoute = require("./Router/emailRoute");
const googleRoute = require('./Router/googleRoute');
const userRoute = require("./Router/userRoute");
const fireRoute = require("./Router/fireRoute");
const masterRoute = require("./Router/masterRoute");
const childRoute = require("./Router/childRoute");
const allocationRoute = require("./Router/allocationRoute");
const budgetRoute = require("./Router/budgetRoute");
const realityBudgetRoute = require("./Router/realityBudgetRoute");
const emergencyRoute = require("./Router/emergencyRoute");
const insuranceRoute = require("./Router/insuranceRoute");
const debtRoute = require("./Router/debtRoute");
const financialRoute = require("./Router/financialRoute");
const riskRoute = require("./Router/riskRoute");
const expensesRoute = require("./Router/expensesRoute");

api.use("/user", emailRoute);
api.use('/google',googleRoute);
api.use("/profile", userRoute);
api.use("/fire", fireRoute);
api.use("/master", masterRoute);
api.use("/child", childRoute);
api.use("/allocation", allocationRoute);
api.use("/budget", budgetRoute);
api.use("/emergency", emergencyRoute);
api.use("/insurance", insuranceRoute);
api.use("/debt", debtRoute);
api.use("/health", financialRoute);
api.use("/risk", riskRoute);
api.use("/realitybudget", realityBudgetRoute);
api.use('/realityExpenses',expensesRoute);

module.exports = api;
