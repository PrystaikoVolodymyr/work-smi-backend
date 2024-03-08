const { Schema, model } = require("mongoose");

const vacancySchema = new Schema(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    companyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Company",
    },
    employeeIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    position: { type: String },
    description: { type: String },
    experience: [{ type: String }],
    workFormat: [{ type: String }],
    salary: {
      amount: { type: Number },
      currency: { type: String },
    },
    employmentType: [{ type: String }],
    category: { type: String },
    location: [{ type: String }],
    relocate: [{ type: String }],
    isActive: { type: Boolean},
    startDate: { type: Date},
    endDate: { type: Date},
  },
  { timestamps: true },
);

module.exports = model("Vacancy", filterSchema);
