const { Schema, model } = require("mongoose");

const companySchema = new Schema(
  {
    companyName: { type: String, required: true, unique: true },
    companyDescription: { type: String, required: false },
    companyWebsite: { type: String },
    admin: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
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

module.exports = model("Company", companySchema);
