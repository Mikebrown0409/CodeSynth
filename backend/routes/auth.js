const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");
const crypto = require("crypto");

// All paths start with '/api/auth'

// Traditional auth routes removed - using GitHub OAuth only

// GitHub OAuth routes
// GET /api/auth/github - Initiate GitHub OAuth
router.get("/github", (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauthState = state;
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&state=${state}&prompt=select_account&allow_signup=true`;
  res.redirect(githubAuthUrl);
});

// GET /api/auth/github/callback - Handle GitHub OAuth callback
router.get("/github/callback", authCtrl.githubCallback);

module.exports = router;
