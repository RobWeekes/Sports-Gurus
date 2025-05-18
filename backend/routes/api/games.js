const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { ScheduledGame, GameResult } = require("../../db/models");


// Get all Scheduled Games
// GET /api/games
router.get("/", async (req, res) => {
  try {
    const { league, date, team } = req.query;
    const where = {};

    // filter by league if provided
    if (league) where.league = league;

    // filter by date if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      where.gameDay = {
        [Op.gte]: startDate,
        [Op.lt]: endDate
      };
    }

    // filter by team if provided
    if (team) {
      where[Op.or] = [
        { homeTeam: team },
        { awayTeam: team }
      ];
    }

    const games = await ScheduledGame.findAll({
      where,
      include: [GameResult],
      order: [["gameDay", "ASC"]]
    });

    return res.json({ games });
  } catch (error) {
    console.error("Error fetching games:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING


// GET /api/games/:gameId - Get a specific game by ID
router.get("/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await ScheduledGame.findByPk(gameId, {
      include: [GameResult]
    });

    if (!game) return res.status(404).json({ message: "Game not found" });

    return res.json({ game });
  } catch (error) {
    console.error("Error fetching game:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING


// ADMIN ONLY ROUTES:

// *TO DO: Add "isAdmin" column to users table (boolean)

// Create a New Scheduled Game (ADMIN)
// POST /api/games
router.post("/", requireAuth, async (req, res) => {
  // check if user is admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const { league, gameDay, homeTeam, awayTeam } = req.body;

    // validate input
    if (!league || !gameDay || !homeTeam || !awayTeam) {
      return res.status(400).json({
        message: "Bad request",
        errors: {
          league: !league ? "League is required" : undefined,
          gameDay: !gameDay ? "Game day is required" : undefined,
          homeTeam: !homeTeam ? "Home team is required" : undefined,
          awayTeam: !awayTeam ? "Away team is required" : undefined
        }
      });
    }

    // create new game
    const newGame = await ScheduledGame.create({
      league,
      gameDay,
      homeTeam,
      awayTeam
    });

    return res.status(201).json({ game: newGame });
  } catch (error) {
    console.error("Error creating game:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// MAYBE WORKING ? NEED "isAdmin" column for users table (boolean)


// Update a Scheduled Game (ADMIN)
// PUT /api/games/:gameId
router.put("/:gameId", requireAuth, async (req, res) => {
  // check if user is admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const { gameId } = req.params;
    const { league, gameDay, homeTeam, awayTeam } = req.body;

    const game = await ScheduledGame.findByPk(gameId);

    if (!game) return res.status(404).json({ message: "Game not found" });

    // update game details
    if (league) game.league = league;
    if (gameDay) game.gameDay = gameDay;
    if (homeTeam) game.homeTeam = homeTeam;
    if (awayTeam) game.awayTeam = awayTeam;

    await game.save();

    return res.json({ game });
  } catch (error) {
    console.error("Error updating game:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// MAYBE WORKING ? NEED "isAdmin" column


// Delete a Scheduled Game (ADMIN)
// DELETE /api/games/:gameId
router.delete("/:gameId", requireAuth, async (req, res) => {
  // check if user is admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const { gameId } = req.params;

    const game = await ScheduledGame.findByPk(gameId);

    if (!game) return res.status(404).json({ message: "Game not found" });

    await game.destroy();

    return res.json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("Error deleting game:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// MAYBE WORKING ? NEED "isAdmin" column



module.exports = router;
