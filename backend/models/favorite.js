const mongoose = require("mongoose");
const { Schema } = mongoose;

const FavoriteSchema = new Schema(
  {
    repo: { type: Schema.Types.ObjectId, ref: "Repo", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Prevent duplicate favorite per user/repo
FavoriteSchema.index({ repo: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", FavoriteSchema); 