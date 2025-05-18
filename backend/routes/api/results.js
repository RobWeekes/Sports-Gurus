const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { requireAuth, requireAdmin } = require("../../utils/auth");
const { GameResult, ScheduledGame, UserPick, sequelize } = require("../../db/models");


// Get all Game Results Matching Query Params
// GET /api/results
router.get("/", async (req, res) => {
  try {
    console.log("-----Checking for game results-----");
    console.log("API request received at /api/results");
    console.log("Query parameters:", req.query);

    const { date, team, status } = req.query;
    console.log("Query parameters:", { date, team, status });
    const where = {};

    // build the "WHERE" object before querying db:

    if (status) {   // case ignored with sequelize "LOWER" method
      where.status = sequelize.where(sequelize.fn("LOWER", sequelize.col("status")), status.toLowerCase());
    }

    // this matches partial strings, ignore case
    if (team) {
      where[Op.or] = [
        sequelize.where(sequelize.fn("LOWER", sequelize.col("homeTeam")), {
          [Op.like]: `%${team.toLowerCase()}%`
        }),
        sequelize.where(sequelize.fn("LOWER", sequelize.col("awayTeam")), {
          [Op.like]: `%${team.toLowerCase()}%`
        })
      ];
    }

    // create a match range that covers the entire day
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      where.gameDay = {
        [Op.gte]: startDate,
        [Op.lt]: endDate
      };
    }

    const results = await GameResult.findAll({
      where,
      order: [["gameDay", "DESC"]]
    });   // view most recent games at the top

    return res.json({ results });
  } catch (error) {
    console.error("Error fetching results:", error);
    return res.status(500).json({ message: "Server error" });
  }
});



// // simple test route
// router.get("/test", (req, res) => {
//   return res.json({ message: "Test route working" });
// });



// Get All the Teams
// GET /api/results/teams
router.get("/teams", async (req, res) => {
  try {
    const games = await ScheduledGame.findAll({
      attributes: ["homeTeam", "awayTeam"]
    });

    // create a set & extract unique team names
    const teams = new Set();
    games.forEach(game => {
      teams.add(game.homeTeam);
      teams.add(game.awayTeam);
    });

    return res.json({ teams: Array.from(teams).sort() });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING



// Get Result for a Specific Game
// GET /api/results/:gameId
router.get("/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;

    const result = await GameResult.findOne({
      where: { game_id: gameId },
      include: [ScheduledGame]
    });

    if (!result) return res.status(404).json({ message: "Result not found" });

    return res.json({ result });
  } catch (error) {
    console.error("Error fetching result:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// TEST


// ADMIN ONLY ROUTES:

// *TO DO: Add "isAdmin" column to users table (boolean)


// Create or Update a Game Result
// POST /api/results
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  // // check if user is admin
  // if (!req.user.isAdmin) {
  //   return res.status(403).json({ message: "Forbidden" });
  // }
  try {
    const {
      game_id, favorite, underdog, status,
      favoriteScore, underdogScore, totalScore,
      totalLine, overUnder, pointSpread, coversSpread
    } = req.body;

    // validate input
    if (!game_id || !favorite || !underdog || !status) {
      return res.status(400).json({
        message: "Bad request",
        errors: {
          game_id: !game_id ? "Game ID is required" : undefined,
          favorite: !favorite ? "Favorite team is required" : undefined,
          underdog: !underdog ? "Underdog team is required" : undefined,
          status: !status ? "Status is required" : undefined
        }
      });
    }

    // check if game exists
    const game = await ScheduledGame.findByPk(game_id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // find or create result
    let result = await GameResult.findOne({ where: { game_id } });

    if (result) {
      // update existing result
      await result.update({
        favorite, underdog, status,
        favoriteScore: favoriteScore || 0,
        underdogScore: underdogScore || 0,
        totalScore: totalScore || 0,
        totalLine: totalLine || 0,
        overUnder: overUnder || "TBD",
        pointSpread: pointSpread || 0,
        coversSpread: coversSpread || "TBD"
      });
    } else {
      // create new result
      result = await GameResult.create({
        game_id, favorite, underdog, status,
        favoriteScore: favoriteScore || 0,
        underdogScore: underdogScore || 0,
        totalScore: totalScore || 0,
        totalLine: totalLine || 0,
        overUnder: overUnder || "TBD",
        pointSpread: pointSpread || 0,
        coversSpread: coversSpread || "TBD"
      });
    }

    // helper function to update user picks based on game result
    async function updateUserPicks(gameId, result) {
      try {
        const picks = await UserPick.findAll({ where: { game_id: gameId } });

        for (const pick of picks) {
          let pickResult = "LOSS";

          // determine if pick was correct based on prediction type
          if (pick.predictionType === "winner") {
            // Winner pick
            if (
              (pick.prediction === result.favorite && result.favoriteScore > result.underdogScore) ||
              (pick.prediction === result.underdog && result.underdogScore > result.favoriteScore)
            ) {
              pickResult = "WIN";
            }
          } else if (pick.predictionType === "spread") {
            // Spread pick
            if (
              (pick.prediction === result.favorite && result.coversSpread === "YES") ||
              (pick.prediction === result.underdog && result.coversSpread === "NO")
            ) {
              pickResult = "WIN";
            }
          } else if (pick.predictionType === "total") {
            // Over/Under pick
            if (
              (pick.prediction === "OVER" && result.overUnder === "OVER") ||
              (pick.prediction === "UNDER" && result.overUnder === "UNDER")
            ) {
              pickResult = "WIN";
            }
          }

          // update pick result
          pick.result = pickResult;
          await pick.save();
        }
      } catch (error) {
        console.error("Error updating user picks:", error);
      }
    }

    // if game is final (over), update all user picks for this game
    if (status === "FINAL") {
      await updateUserPicks(game_id, result);
    }

    return res.json({ result });
  } catch (error) {
    console.error("Error creating/updating result:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// TEST



// Delete a Game Result
// DELETE /api/results/:gameId
router.delete("/:gameId", requireAuth, requireAdmin, async (req, res) => {
  // check if user is admin
  // if (!req.user.isAdmin) {
  //   return res.status(403).json({ message: "Forbidden" });
  // }
  try {
    const { gameId } = req.params;

    const result = await GameResult.findOne({ where: { game_id: gameId } });

    if (!result) return res.status(404).json({ message: "Result not found" });

    await result.destroy();

    // reset all user picks for this game
    await UserPick.update(
      { result: "TBD" },
      { where: { game_id: gameId } }
    );

    return res.json({ message: "Result deleted successfully" });
  } catch (error) {
    console.error("Error deleting result:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
//



module.exports = router;
