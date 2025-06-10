const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RepoSchema = new Schema(
  {
    repo_id: { type: String, required: true, unique: true, trim: true },
    repo_url: { type: String, required: true },
    repo_name: { type: String, required: true, trim: true },
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

module.exports = mongoose.model("Repo", RepoSchema);
