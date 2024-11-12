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

api.use('/user',emailRoute);
api.use('/profile',userRoute);
api.use('/fire',fireRoute);
api.use('/master',masterRoute);
api.use('/child',childRoute);
api.use('/allocation',allocationRoute);
api.use('/budget',budgetRoute);
api.use('/emergency',emergencyRoute);

module.exports = api;