const { Schema, model } = require("mongoose");

const filterSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    keyWords: [{ type: String }],
    activity: { type: String },
    templates: [
      {
        name: { type: String },
        messages: [{ type: String }],
      },
    ],
  },
  { timestamps: true },
);

module.exports = model("RecruiterFilter", filterSchema);
