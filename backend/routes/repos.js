const express = require("express");
const router = express.Router();
const repoCtrl = require("../controllers/repos");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");

// All paths are prefixed with /api/repo

// GET /api/repos - Get user's repositories (requires auth)
router.get("/", ensureLoggedIn, repoCtrl.index);

// POST /api/repos/analyze - Analyze a repository (requires auth)
router.post("/analyze", ensureLoggedIn, repoCtrl.analyzeRepository);

// POST /api/repos/file-content - Get file content (requires auth)
router.post("/file-content", ensureLoggedIn, repoCtrl.getFileContent);

// DELETE /api/repos/:id - Delete a repository (requires auth)
router.delete("/:id", ensureLoggedIn, repoCtrl.deleteRepo);

// POST /api/repos/fix - Return auto-fixed code for a file (requires auth)
router.post("/fix", ensureLoggedIn, repoCtrl.fixFile);

// POST /api/repos/commit-fixes - Commit auto-fixes to repository (requires auth)
router.post("/commit-fixes", ensureLoggedIn, repoCtrl.commitFixes);

module.exports = router;
