const mongoose = require("mongoose");

const realityIncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    date: { 
        type: String, 
        required: true 
    },
    income: {
      type: String,
      required: true,
    },
    otherIncome: {
      type: Array,
      required: true,
    },
    totalIncome: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RealityIncome", realityIncomeSchema);
