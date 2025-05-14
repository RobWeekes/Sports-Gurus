import { FaUserCircle, FaFootballBall, FaBasketballBall, FaGolfBall } from "react-icons/fa";
import { FcSportsMode } from "react-icons/fc";
import { GiBoxingGlove, GiCricketBat } from "react-icons/gi";
import { IoCarSportSharp } from "react-icons/io5";
import { MdSportsFootball, MdOutlineSportsFootball, MdSportsBasketball, MdOutlineSportsBasketball, MdOutlineSportsBaseball, MdSportsHockey, MdSportsSoccer, MdSportsTennis, MdSportsVolleyball, MdOutlineSportsVolleyball, MdOutlineSportsCricket, MdSportsMma, MdOutlineSportsMma, MdSportsRugby, MdOutlineSportsRugby, MdOutlineSportsScore, MdSportsMartialArts, MdSportsGolf, MdSportsMotorsports, MdSportsGymnastics, MdOutlineSportsKabaddi } from "react-icons/md";
// import the FontAwesomeIcon component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// then import specific icons to use:
import { faVolleyball, faBaseball, faBaseballBatBall, faTableTennisPaddleBall, faHockeyPuck  } from "@fortawesome/free-solid-svg-icons";
// render icon using prop: <FontAwesomeIcon icon={faIcon} />


function SportIcon({ sporticon, size = "1em", color = "currentColor" }) {
  // map sport names to icons
  const sportIcons = {
    "football": <FaFootballBall />,
    "football2": <MdOutlineSportsFootball />,
    "football3": <MdSportsFootball />,
    "basketball": <FaBasketballBall />,
    "basketball2": <MdSportsBasketball />,
    "basketball3": <MdOutlineSportsBasketball />,
    "baseball": <MdOutlineSportsBaseball />,
    "baseball2": <FontAwesomeIcon icon={faBaseball} />,
    "baseball3": <FontAwesomeIcon icon={faBaseballBatBall} />,
    // <i class="fa-regular fa-baseball"></i>
    "boxing": <GiBoxingGlove />,
    "cricket": <GiCricketBat />,
    "cricket2": <MdOutlineSportsCricket />,
    "golf": <FaGolfBall />,
    "golf2": <MdSportsGolf />,
    "gymnastics": <MdSportsGymnastics />,
    "hockey": <MdSportsHockey />,
    "hockey2": <FontAwesomeIcon icon={faHockeyPuck} />,
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
    "tabletennis": <FontAwesomeIcon icon={faTableTennisPaddleBall} />,
    "track": <FcSportsMode />,
    "usercircle": <FaUserCircle />,
    "volleyball": <MdSportsVolleyball />,
    "volleyball2": <MdOutlineSportsVolleyball />,
    "volleyball3": <FontAwesomeIcon icon={faVolleyball} />,
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
