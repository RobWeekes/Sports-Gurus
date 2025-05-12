import { FaUserCircle } from "react-icons/fa";
import { MdSportsFootball, MdOutlineSportsFootball, MdOutlineSportsBasketball, MdOutlineSportsBaseball, MdSportsBaseball, MdSportsHockey, MdSportsSoccer, MdSportsTennis, MdSportsVolleyball } from "react-icons/md";
import { FaFootballBall, FaBasketballBall, FaBaseballBall, FaHockeyPuck, FaGolfBall } from "react-icons/fa";
import { GiBoxingGlove, GiCricketBat } from "react-icons/gi";

function SportIcon({ sporticon, size = "1em", color = "currentColor" }) {
  // map sport names to icons
  const sportIcons = {
    "football": <FaFootballBall />,
    "football2": <MdOutlineSportsFootball />,
    "football3": <MdSportsFootball />,
    "basketball": <FaBasketballBall />,
    "basketball2": <MdOutlineSportsBasketball />,
    "baseball": <FaBaseballBall />,
    "baseball2": <MdOutlineSportsBaseball />,
    "baseball3": <MdSportsBaseball />,
    "hockey": <FaHockeyPuck />,
    "hockey2": <MdSportsHockey />,
    "soccer": <MdSportsSoccer />,
    "tennis": <MdSportsTennis />,
    "volleyball": <MdSportsVolleyball />,
    "golf": <FaGolfBall />,
    "boxing": <GiBoxingGlove />,
    "cricket": <GiCricketBat />,
    "usercircle": <FaUserCircle />
  };

  // Return the icon with the specified size and color
  return (
    <div style={{ fontSize: size, color: color }}>
      {sportIcons[sporticon] || sportIcons["usercircle"]}
      {/* default to usercircle if sport not found */}
    </div>
  );
}

export default SportIcon;
