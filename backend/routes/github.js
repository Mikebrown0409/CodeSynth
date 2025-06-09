const express = require("express");
const router = express.Router();
const githubCtrl = require("../controllers/githubController");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");

// All paths are prefixed with /api/github

// Protect all routes
router.use(ensureLoggedIn);

// POST /api/github/analyze - Analyze a repository
router.post("/analyze", githubCtrl.analyzeRepository);

module.exports = router;
