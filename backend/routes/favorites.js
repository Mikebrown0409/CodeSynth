const express = require("express");
const router = express.Router();
const favCtrl = require("../controllers/favorites");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");

// GET /api/favorites - list user's favorites
router.get("/", ensureLoggedIn, favCtrl.index);

// POST /api/favorites/:repoId - toggle favorite
router.post("/:repoId", ensureLoggedIn, favCtrl.toggle);

module.exports = router; 