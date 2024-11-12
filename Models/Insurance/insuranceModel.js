const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    policyNumber: {
      type: Number,
      required: false,
    },
    policyName: {
      type: String,
      required: false,
    },
    provider: {
      type: String,
      required: false,
    },
    coverageAmount: {
      type: Number,
      required: false,
    },
    premiumAmount: {
      type: Number,
      required: false,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    beneficiaries: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Insurance", insuranceSchema);
