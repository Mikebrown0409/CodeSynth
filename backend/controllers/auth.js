const User = require("../models/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");

module.exports = {
  githubCallback,
};

// Traditional signup and login functions removed - using GitHub OAuth only

async function githubCallback(req, res) {
  try {
    const { code, state } = req.query;
    
    // Verify state to prevent CSRF attacks
    if (state !== req.session.oauthState) {
      return res.status(400).json({ error: "Invalid state parameter" });
    }
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
    }, {
      headers: { 'Accept': 'application/json' }
    });
    
    const accessToken = tokenResponse.data.access_token;
    
    // Get user info from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { 'Authorization': `token ${accessToken}` }
    });
    
    const githubUser = userResponse.data;
    
    // Get user email (might be private)
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { 'Authorization': `token ${accessToken}` }
    });
    
    const primaryEmail = emailResponse.data.find(email => email.primary)?.email || githubUser.email;
    
    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { email: primaryEmail },
        { githubId: githubUser.id.toString() }
      ]
    });
    
    if (!user) {
      // Create new user
      user = await User.create({
        name: githubUser.name || githubUser.login,
        email: primaryEmail,
        githubId: githubUser.id.toString(),
        githubUsername: githubUser.login,
        githubAccessToken: accessToken,
        password: 'github-oauth-user' // Placeholder since GitHub users don't need password
      });
    } else {
      // Update existing user with GitHub info
      user.githubId = githubUser.id.toString();
      user.githubUsername = githubUser.login;
      user.githubAccessToken = accessToken;
      await user.save();
    }
    
    // Create JWT
    const token = createJWT(user);
    
    // Clear OAuth state
    delete req.session.oauthState;
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${token}`);
    
  } catch (err) {
    // GitHub OAuth error
    res.status(500).json({ error: "GitHub authentication failed" });
  }
}

/*--- Helper Functions ---*/

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: "24h" }
  );
}
