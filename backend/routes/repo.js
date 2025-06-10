const express = require("express");
const router = express.Router();
const repoCtrl = require("../controllers/repos");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");

// All paths are prefixed with /api/repo

// Protect all routes
router.use(ensureLoggedIn);

// GET /api/repo (INDEX)
router.get("/", repoCtrl.index);

// POST /api/repo/analyze - Analyze a repository
router.post("/analyze", repoCtrl.analyzeRepository);

// POST /api/repo/content - Analyze repository files
router.post("/content", repoCtrl.getFileContent);

module.exports = router;
