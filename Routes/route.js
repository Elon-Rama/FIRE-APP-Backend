const express = require("express");
const api = express.Router();

const emailRoute = require('./Router/emailRoute');
const userRoute = require('./Router/userRoute');
const fireRoute = require("./Router/fireRoute");
const masterRoute = require("./Router/masterRoute");
const childRoute = require("./Router/childRoute");
const allocationRoute = require("./Router/allocationRoute");
const budgetRoute = require("./Router/budgetRoute");
const emergencyRoute = require('./Router/emergencyRoute');
const insuranceRoute = require('./Router/insuranceRoute');
const debtRoute = require('./Router/debtRoute');
const financialRoute = require('./Router/financialRoute');

api.use('/user',emailRoute);
api.use('/profile',userRoute);
api.use('/fire',fireRoute);
api.use('/master',masterRoute);
api.use('/child',childRoute);
api.use('/allocation',allocationRoute);
api.use('/budget',budgetRoute);
api.use('/emergency',emergencyRoute);
api.use('/insurance',insuranceRoute);
api.use('/debt',debtRoute);
api.use('/health',financialRoute);

module.exports = api;