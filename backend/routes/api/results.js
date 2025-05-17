const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { GameResult, ScheduledGame, UserPick, sequelize } = require("../../db/models");


// helper function to build "where" clause for ScheduledGame
function buildGameWhere(date, team) {
  const where = {};

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    where.gameDay = {
      [Op.gte]: startDate,
      [Op.lt]: endDate
    };
  }

  // partial query matching (matches parts of words, works in dev - SQLite)
  if (team) {
    where[Op.or] = [
      { homeTeam: { [Op.like]: `%${team}%` } },
      { awayTeam: { [Op.like]: `%${team}%` } }
    ];
  }

  // if (team) {
  //   // this regular expression matches team name as a whole word
  //   // will match team name at beginning, end, or between word boundaries
  //   const teamPattern = `(^|\\s)${team}(\\s|$)`;
  //   // word boundary matching, ignore case - Op.regexp operator is supported in MySQL and PostgreSQL, but not in SQLite (not in dev)
  //   where[Op.or] = [
  //     sequelize.where(sequelize.fn('LOWER', sequelize.col('homeTeam')), {
  //       [Op.regexp]: teamPattern.toLowerCase()
  //     }),
  //     sequelize.where(sequelize.fn('LOWER', sequelize.col('awayTeam')), {
  //       [Op.regexp]: teamPattern.toLowerCase()
  //     })
  //   ];
  // }

  return where;
}


// Get all Game Results Matching Query Params
// GET /api/results
router.get("/", async (req, res) => {
  try {
    console.log("Checking for game results...");

    // check if there is any data in results table
    const allResults = await GameResult.findAll();
    console.log(`Total game results in database: ${allResults.length}`);

    const allGames = await ScheduledGame.findAll();
    console.log(`Total scheduled games in database: ${allGames.length}`);

    if (allGames.length > 0) {
      console.log("Sample game data:");
      console.log(allGames[0].toJSON());
    }

    const { date, team, status } = req.query;
    console.log("Query parameters:", { date, team, status });
    const where = {};

    if (status) {
      where.status = status;
      console.log("Filtering by status:", status);
    }

    const results = await GameResult.findAll({
      where,
      include: [{
        model: ScheduledGame,
        where: date || team ? buildGameWhere(date, team) : {}
      }],
      order: [[ScheduledGame, "gameDay", "DESC"]]
    });

    return res.json({ results });
  } catch (error) {
    console.error("Error fetching results:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


// Get All the Teams
// GET /api/results/teams
router.get("/teams", async (req, res) => {
  try {
    const games = await ScheduledGame.findAll({
      attributes: ['homeTeam', 'awayTeam']
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
//


// ADMIN ONLY ROUTES:

// *TO DO: Add "isAdmin" column to users table (boolean)


// POST /api/results - Create or update a game result
router.post("/", requireAuth, async (req, res) => {
  // check if user is admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

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

    // if game is final, update all user picks for this game
    if (status === "FINAL") {
      await updateUserPicks(game_id, result);
    }

    return res.json({ result });
  } catch (error) {
    console.error("Error creating/updating result:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

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
//


// Delete a Game Result
// DELETE /api/results/:gameId
router.delete("/:gameId", requireAuth, async (req, res) => {
  // check if user is admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

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
