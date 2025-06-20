const Favorite = require("../models/favorite");

async function index(req, res) {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate("repo");
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
}

async function toggle(req, res) {
  try {
    const { repoId } = req.params;
    const userId = req.user._id;

    const existing = await Favorite.findOne({ repo: repoId, user: userId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ favorited: false });
    }

    const favorite = await Favorite.create({ repo: repoId, user: userId });
    res.json({ favorited: true, favorite });
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle favorite" });
  }
}

module.exports = { index, toggle }; 