const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { UserPickPage, UserPick, ScheduledGame } = require("../../db/models");


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


// Create a New Pick Page
// POST /api/pickpages
router.post("/", requireAuth, async (req, res) => {
  try {
    const { pageName } = req.body;

    if (!pageName) {
      return res.status(400).json({
        message: "Bad request",
        errors: { pageName: "Page name is required" }
      });
    }

    const newPage = await UserPickPage.create({
      user_id: req.user.id,
      pageName
    });

    return res.status(201).json({ pickPage: newPage });
  } catch (error) {
    console.error("Error creating pick page:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING


// Get a Specific Pick Page
// GET /api/pickpages/:pageId
router.get("/:pageId", requireAuth, async (req, res) => {
  try {
    const { pageId } = req.params;

    const pickPage = await UserPickPage.findByPk(pageId, {
      include: [{
        model: UserPick,
        include: [ScheduledGame]
      }]
    });

    if (!pickPage) return res.status(404).json({ message: "Pick page not found" });

    // Ensure user can only access their own pick pages
    if (pickPage.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json({ pickPage });
  } catch (error) {
    console.error("Error fetching pick page:", error);
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

    // only changing the name of pick page, so far
    pickPage.pageName = pageName;
    await pickPage.save();

    return res.json({ pickPage });
  } catch (error) {
    console.error("Error updating pick page:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING


// Delete a Pick Page
// DELETE /api/pickpages/:pageId
router.delete("/:pageId", requireAuth, async (req, res) => {
  try {
    const { pageId } = req.params;

    const pickPage = await UserPickPage.findByPk(pageId);

    if (!pickPage) return res.status(404).json({ message: "Pick page not found" });

    // Ensure user can only delete their own pick pages
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
