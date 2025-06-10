const express = require("express");
const router = express.Router();
const githubCtrl = require("../controllers/gits");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");

// All paths are prefixed with /api/github

// Protect all routes
router.use(ensureLoggedIn);

// POST /api/github/analyze - Analyze a repository
router.post("/analyze", githubCtrl.analyzeRepository);

// POST /api/github/content - Analyze repository files
router.post("/content", githubCtrl.getFileContent);

module.exports = router;
