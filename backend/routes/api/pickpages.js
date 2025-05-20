const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { UserPickPage, UserPick, ScheduledGame } = require("../../db/models");
const { Op } = require("sequelize");


// Get all Pick Pages for Current User
// GET /api/pickpages
router.get("/", requireAuth, async (req, res) => {
  try {
    const pickPages = await UserPickPage.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]]
    });

    return res.json({ pickPages });
  } catch (error) {
    console.error("Error fetching pick pages:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING


// Get all Pick Pages for a Specific User
// GET /api/pickpages/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // validate that userId is a number
    if (isNaN(parseInt(userId))) {
      return res.status(400).json({ message: "User ID must be a number" });
    }

    const pickPages = await UserPickPage.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: UserPick,
          attributes: ["id", "predictionType", "prediction", "result"]
        }
      ]
    });

    return res.json({ pickPages });
  } catch (error) {
    console.error("Error fetching pick pages:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING - requireAuth ?


// Get a Specific Pick Page with detailed picks
// GET /api/pickpages/:pageId
router.get("/:pageId", requireAuth, async (req, res) => {
  try {
    const { pageId } = req.params;

    const pickPage = await UserPickPage.findByPk(pageId, {
      include: [{
        model: UserPick,
        include: [{
          model: ScheduledGame,
          attributes: ["id", "league", "gameDay", "homeTeam", "awayTeam"]
        }]
      }]
    });

    if (!pickPage) return res.status(404).json({ message: "Pick page not found" });

    // Optional: Check if user owns this page
    // Uncomment if you want to restrict access to only the page owner
    // if (pickPage.user_id !== req.user.id) {
    //   return res.status(403).json({ message: "Forbidden" });
    // }

    return res.json({ pickPage });
  } catch (error) {
    console.error("Error fetching pick page:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING


// Create a New Pick Page
// POST /api/pickpages
router.post("/", requireAuth, async (req, res) => {
  try {
    const { pageName } = req.body;
    const userId = req.user.id;

    if (!pageName) {
      return res.status(400).json({
        message: "Bad request",
        errors: { pageName: "Page name is required" }
      });
    }

    // check if user already has a page with this name
    const existingPage = await UserPickPage.findOne({
      where: {
        user_id: userId,
        pageName
      }
    });

    if (existingPage) {
      return res.status(400).json({
        message: "Bad request",
        errors: { pageName: "You already have a pick page with this name" }
      });
    }

    const newPage = await UserPickPage.create({
      user_id: userId,
      pageName
    });

    return res.status(201).json({ pickPage: newPage });
  } catch (error) {
    console.error("Error creating pick page:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING


// Update a Pick Page by Page ID
// PUT /api/pickpages/:pageId
router.put("/:pageId", requireAuth, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { pageName } = req.body;

    const pickPage = await UserPickPage.findByPk(pageId);

    if (!pickPage) return res.status(404).json({ message: "Pick page not found" });

    // ensure user can only update their own pick pages
    if (pickPage.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // check if user already has a page with this name
    const existingPage = await UserPickPage.findOne({
      where: {
        user_id: req.user.id,
        pageName,
        id: { [Op.ne]: pageId }
      }    // (Op."not equals") exclude the current page
    });

    if (existingPage) {
      return res.status(400).json({
        message: "Bad request",
        errors: { pageName: "You already have a pick page with this name" }
      });
    }

    // only changing the name of pick page - so far
    pickPage.pageName = pageName;
    await pickPage.save();

    return res.json({ pickPage });
  } catch (error) {
    console.error("Error updating pick page:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING test


// Delete a Pick Page
// DELETE /api/pickpages/:pageId
router.delete("/:pageId", requireAuth, async (req, res) => {
  try {
    const { pageId } = req.params;

    const pickPage = await UserPickPage.findByPk(pageId);

    if (!pickPage) return res.status(404).json({ message: "Pick page not found" });

    // ensure user can only delete their own pick pages
    if (pickPage.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await pickPage.destroy();

    return res.json({ message: "Pick page deleted successfully" });
  } catch (error) {
    console.error("Error deleting pick page:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING



module.exports = router;
