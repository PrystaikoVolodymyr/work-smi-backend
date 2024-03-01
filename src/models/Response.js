const { Schema, model } = require("mongoose");

const responseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    resume: { type: String, required: false },
    coverLetter: { type: String, required: false },
    templates: [
      {
        name: { type: String },
        messages: [{ type: String }]
      },
    ]
  },
  { timestamps: true }
);

module.exports = model("Response", responseSchema);
