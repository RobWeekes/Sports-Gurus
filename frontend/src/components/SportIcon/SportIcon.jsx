import { FaUserCircle, FaFootballBall, FaBasketballBall, FaBaseballBall, FaHockeyPuck, FaGolfBall } from "react-icons/fa";
import { FcSportsMode } from "react-icons/fc";
import { GiBoxingGlove, GiCricketBat } from "react-icons/gi";
import { IoCarSportSharp } from "react-icons/io5";
import { MdSportsFootball, MdOutlineSportsFootball, MdSportsBasketball, MdOutlineSportsBasketball, MdOutlineSportsBaseball, MdSportsBaseball, MdSportsHockey, MdSportsSoccer, MdSportsTennis, MdSportsVolleyball, MdOutlineSportsVolleyball, MdOutlineSportsCricket, MdSportsMma, MdOutlineSportsMma, MdSportsRugby, MdOutlineSportsRugby, MdOutlineSportsScore, MdSportsMartialArts, MdSportsGolf, MdSportsMotorsports, MdSportsGymnastics, MdOutlineSportsKabaddi } from "react-icons/md";


function SportIcon({ sporticon, size = "1em", color = "currentColor" }) {
  // map sport names to icons
  const sportIcons = {
    "football": <FaFootballBall />,
    "football2": <MdOutlineSportsFootball />,
    "football3": <MdSportsFootball />,
    "basketball": <FaBasketballBall />,
    "basketball2": <MdSportsBasketball />,
    "basketball3": <MdOutlineSportsBasketball />,
    "baseball": <FaBaseballBall />,
    "baseball2": <MdOutlineSportsBaseball />,
    "baseball3": <MdSportsBaseball />,
    "boxing": <GiBoxingGlove />,
    "cricket": <GiCricketBat />,
    "cricket2": <MdOutlineSportsCricket />,
    "golf": <FaGolfBall />,
    "golf2": <MdSportsGolf />,
    "gymnastics": <MdSportsGymnastics />,
    "hockey": <FaHockeyPuck />,
    "hockey2": <MdSportsHockey />,
    "martialarts": <MdSportsMartialArts />,
    "mma": <MdSportsMma />,
    "mma2": <MdOutlineSportsMma />,
    "motorsports": <MdSportsMotorsports />,
    "nascar": <IoCarSportSharp />,
    "racing": <MdOutlineSportsScore />,
    "rugby": <MdSportsRugby />,
    "rugby2": <MdOutlineSportsRugby />,
    "soccer": <MdSportsSoccer />,
    "tennis": <MdSportsTennis />,
    "track": <FcSportsMode />,
    "usercircle": <FaUserCircle />,
    "volleyball": <MdSportsVolleyball />,
    "volleyball2": <MdOutlineSportsVolleyball />,
    "wrestling": <MdOutlineSportsKabaddi />,
  };

  // return the icon with the specified size and color
  return (
    <div style={{ fontSize: size, color: color }}>
      {sportIcons[sporticon] || sportIcons["usercircle"]}
      {/* default to usercircle if sport not found */}
    </div>
  );
}



export default SportIcon;
