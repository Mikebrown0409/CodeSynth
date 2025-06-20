const path = require("path"); // Built into Node
const express = require("express");
const logger = require("morgan");
const session = require("express-session");
const app = express();

// Process the secrets/config vars in .env
require("dotenv").config();

// Connect to the database
require("./db");

app.set("trust proxy", 1); // Trust first proxy so secure cookies work behind Heroku

app.use(logger("dev"));

// Session middleware for OAuth state
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static assets from the frontend's built code folder (dist)
app.use(express.static(path.join(__dirname, "../frontend/dist")));
// Note that express.urlencoded middleware is not needed
// because forms are not submitted!
app.use(express.json());

// Middleware to check the request's headers for a JWT and
// verify that it's a valid.  If so, it will assign the
// user object in the JWT's payload to req.user
app.use(require("./middleware/checkToken"));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/repos", require("./routes/repos"));

// Use a "catch-all" route to deliver the frontend's production index.html
app.get("/*splat", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // Server started on port ${port}
});
