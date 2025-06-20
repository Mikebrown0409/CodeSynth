const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 6;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while maintaining uniqueness
    },
    githubUsername: {
      type: String,
    },
    githubAccessToken: {
      type: String,
    },
    repositories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Repo",
      },
    ],
  },
  {
    timestamps: true,
    // Remove password when doc is sent across network
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.githubAccessToken; // Don't expose access token
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  // 'this' is the user document
  if (!this.isModified("password")) return next();
  // Replace the password with the computed hash
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

module.exports = mongoose.model("User", userSchema);
