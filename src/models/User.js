const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    displayName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    uid: { type: String, required: true, unique: true },
    image: { type: String, required: false },
    resume: [{ type: String }],
    phone: { type: String, required: false },
    position: { type: String, required: false },
    achievements: { type: String, required: false },
    role: { type: String },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    middleName: { type: String, required: false },
    socialNetworks: [
      {
        title: { type: String },
        link: { type: String }
      },
    ],
    jobData: [
      {
        position: { type: String },
        company: { type: String },
        currentJob: { type: Boolean },
        startMonth: { type: String },
        startYear: { type: String },
        endMonth: { type: String },
        endYear: { type: String },
      },
    ],
    educationData: [
      {
        degree: { type: String },
        institution: { type: String },
        currentEducation: { type: Boolean },
        startMonth: { type: String },
        startYear: { type: String },
        endMonth: { type: String },
        endYear: { type: String },
      },
    ],
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    recruiters: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

module.exports = model("User", userSchema);
