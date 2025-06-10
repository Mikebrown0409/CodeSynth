const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GitSchema = new Schema(
  {
    owner: { type: String, required: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    githubId: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastAnalyzed: { type: Date, default: Date.now },
    isPublic: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Git", GitSchema);
