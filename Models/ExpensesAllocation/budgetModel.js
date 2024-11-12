
const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    income: {
        type: Number,
        required: true,
    },
    otherIncome: {
        type: [Number], 
        default: [],
    },
    totalIncome: {
                type: Number,
                required: true,
            },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
