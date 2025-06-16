const express = require("express");
const router = express.Router();
const repoCtrl = require("../controllers/repos");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");

// All paths are prefixed with /api/repo

// Protect all routes
router.use(ensureLoggedIn);

// GET /api/repos (INDEX)
router.get("/", repoCtrl.index);

// DELETE /api/repos/:id
router.delete("/:id", repoCtrl.deleteRepo);

// POST /api/repos/analyze - Analyze a repository
router.post("/analyze", repoCtrl.analyzeRepository);

// POST /api/repos/content - Analyze repository files
router.post("/content", repoCtrl.getFileContent);

// POST /api/repos/fix - Return auto-fixed code for a file
router.post("/fix", repoCtrl.fixFile);

module.exports = router;
