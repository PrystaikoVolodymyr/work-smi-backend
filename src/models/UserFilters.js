const { Schema, model } = require("mongoose");

const filterSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    experience: { type: String },
    workFormat: [{ type: String }],
    salary: {
      amount: { type: Number },
      currency: { type: String },
    },
    employmentType: [{ type: String }],
    skils: [{ type: String }],
    categories: [{ type: String }],
    benefits: [{ type: String }],
    keyWords: [{ type: String }],
    location: [{ type: String }],
    activity: { type: String },
    position: { type: String },
    businessTrip: { type: Boolean },
    relocate: [{ type: String }],
    languages: [
      {
        name: { type: String },
        level: [{ type: String }],
      },
    ],
  },
  { timestamps: true },
);

module.exports = model("UserFilter", filterSchema);
