const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { UserPick, UserPickPage, ScheduledGame } = require("../../db/models");
const { Op } = require("sequelize");


// Get all Picks for the Current User
// GET /api/picks
router.get("/", requireAuth, async (req, res) => {
  try {
    const picks = await UserPick.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: ScheduledGame },
        { model: UserPickPage }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.json({ picks });
  } catch (error) {
    console.error("Error fetching picks:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


// Get a Pick by Pick ID
// GET /api/picks/:pickId
router.get("/:pickId", requireAuth, async (req, res) => {
  try {
    const { pickId } = req.params;

    const pick = await UserPick.findOne({
      where: {
        id: pickId,
        user_id: req.user.id
      },
      include: [
        { model: ScheduledGame },
        { model: UserPickPage }
      ]
    });

    if (!pick) {
      return res.status(404).json({ message: "Pick not found" });
    }

    return res.json({ pick });
  } catch (error) {
    console.error("Error fetching pick:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


// Get Picks for a Specific Game
// GET /api/picks/game/:gameId
router.get("/game/:gameId", requireAuth, async (req, res) => {
  try {
    const { gameId } = req.params;

    const picks = await UserPick.findAll({
      where: {
        game_id: gameId,
        user_id: req.user.id
      },
      include: [
        { model: UserPickPage }
      ]
    });

    return res.json({ picks });
  } catch (error) {
    console.error("Error fetching game picks:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


// Create a New Pick
// POST /api/picks
router.post("/", requireAuth, async (req, res) => {
  try {
    const { page_id, game_id, predictionType, prediction } = req.body;

    // validate required fields
    if (!page_id || !game_id || !predictionType || !prediction) {
      return res.status(400).json({
        message: "Bad request",
        errors: {
          page_id: !page_id ? "Page ID is required" : undefined,
          game_id: !game_id ? "Game ID is required" : undefined,
          predictionType: !predictionType ? "Prediction type is required" : undefined,
          prediction: !prediction ? "Prediction is required" : undefined
        }
      });
    }

    // verify the page belongs to the user
    const page = await UserPickPage.findOne({
      where: { id: page_id, user_id: req.user.id }
    });

    if (!page) {
      return res.status(404).json({ message: "Pick page not found or unauthorized" });
    }

    // verify the game exists
    const game = await ScheduledGame.findByPk(game_id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // check if a pick already exists for this game and page
    const existingPick = await UserPick.findOne({
      where: {
        user_id: req.user.id,
        page_id,
        game_id
      }
    });

    if (existingPick) {
      // update existing pick
      await existingPick.update({
        predictionType,
        prediction,
        result: "TBD" // Reset result when prediction is changed
      });

      return res.json({ pick: existingPick });
    }

    // create new pick
    const newPick = await UserPick.create({
      user_id: req.user.id,
      page_id,
      game_id,
      predictionType,
      prediction,
      result: "TBD"
    });

    return res.status(201).json({ pick: newPick });
  } catch (error) {
    console.error("Error creating pick:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


// Update a Pick
// PUT /api/picks/:pickId
router.put("/:pickId", requireAuth, async (req, res) => {
  try {
    const { pickId } = req.params;
    const { predictionType, prediction } = req.body;

    // find the pick
    const pick = await UserPick.findOne({
      where: {
        id: pickId,
        user_id: req.user.id
      }
    });

    if (!pick) {
      return res.status(404).json({ message: "Pick not found or unauthorized" });
    }

    // update the pick
    await pick.update({
      predictionType: predictionType || pick.predictionType,
      prediction: prediction || pick.prediction,
      result: "TBD" // Reset result when prediction is changed
    });

    return res.json({ pick });
  } catch (error) {
    console.error("Error updating pick:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


// Delete a User"s Pick
// DELETE /api/picks/:pickId
router.delete("/:pickId", requireAuth, async (req, res) => {
  try {
    const { pickId } = req.params;

    // find the pick
    const pick = await UserPick.findOne({
      where: {
        id: pickId,
        user_id: req.user.id
      }
    });

    if (!pick) {
      return res.status(404).json({ message: "Pick not found or unauthorized" });
    }

    // delete the pick
    await pick.destroy();

    return res.json({ message: "Pick deleted successfully" });
  } catch (error) {
    console.error("Error deleting pick:", error);
    return res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
