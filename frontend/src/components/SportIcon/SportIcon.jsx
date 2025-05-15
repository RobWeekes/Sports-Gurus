import { CiBaseball } from "react-icons/ci";
import { FaUserCircle, FaFootballBall, FaGolfBall } from "react-icons/fa";
import { FaVolleyball } from "react-icons/fa6";
import { FcSportsMode } from "react-icons/fc";
import { GiAmericanFootballHelmet, GiAmericanFootballPlayer, GiBasketballBasket, GiBasketballJersey, GiBaseballGlove, GiBoxingGlove, GiCricketBat, GiSoccerBall, GiSoccerField, GiHockey, GiBoxingRing, GiTennisBall, GiTennisCourt, GiTennisRacket, GiF1Car, GiFullMotorcycleHelmet } from "react-icons/gi";
import { IoCarSportSharp, IoCarSportOutline } from "react-icons/io5";
import { LiaGolfBallSolid } from "react-icons/lia";
import { LuVolleyball } from "react-icons/lu";
import { MdSportsHockey, MdSportsSoccer, MdSportsTennis, MdOutlineSportsCricket, MdSportsMma, MdOutlineSportsMma, MdSportsRugby, MdOutlineSportsRugby, MdOutlineSportsScore, MdSportsMartialArts, MdSportsGolf, MdGolfCourse, MdSportsMotorsports, MdOutlineSportsKabaddi } from "react-icons/md";
import { PiFootballHelmetDuotone, PiBaseball, PiCourtBasketballDuotone, PiSoccerBallDuotone, PiHockeyDuotone, PiBoxingGloveDuotone, PiVolleyballDuotone } from "react-icons/pi";
import { RiBoxingFill } from "react-icons/ri";
import { TbKarate } from "react-icons/tb";
import { TbOlympics } from "react-icons/tb";
// import the FontAwesomeIcon component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// then import specific icons to use:
import { faBaseballBatBall, faBasketball, faVolleyball, faHockeyPuck } from "@fortawesome/free-solid-svg-icons";


function SportIcon({ sporticon, size = "1em", color = "currentColor" }) {
  // map sport names to icons
  const sportIcons = {
    "football": <FaFootballBall />,
    "football2": <GiAmericanFootballHelmet />,
    "football3": <PiFootballHelmetDuotone  />,
    "football4": <GiAmericanFootballPlayer />,
    "baseball": <CiBaseball />,
    "baseball2": <PiBaseball />,
    "baseball3": <FontAwesomeIcon icon={faBaseballBatBall} />,
    "baseball4": <GiBaseballGlove />,
    // "baseball": <FontAwesomeIcon icon={faBaseball} />,
    // "basketball2": <MdOutlineSportsBasketball />,
    "basketball": <FontAwesomeIcon icon={faBasketball} />,
    "basketball2": <GiBasketballJersey />,
    "basketball3": <PiCourtBasketballDuotone />,
    "basketball4": <GiBasketballBasket />,
    "soccer": <GiSoccerBall />,
    "soccer2": <PiSoccerBallDuotone  />,
    "soccer3": <MdSportsSoccer />,
    "soccer4": <GiSoccerField />,
    "hockey": <FontAwesomeIcon icon={faHockeyPuck} />,
    "hockey2": <GiHockey />,
    "hockey3": <MdSportsHockey />,
    "hockey4": <PiHockeyDuotone />,
    "boxing": <RiBoxingFill />,
    "boxing2": <GiBoxingGlove />,
    "boxing3": <PiBoxingGloveDuotone />,
    "boxing4": <GiBoxingRing />,
    "mma": <MdSportsMma />,
    "mma2": <MdOutlineSportsMma />,
    "karate": <TbKarate />,
    "martialarts": <MdSportsMartialArts />,
    "golf": <LiaGolfBallSolid />,
    "golf2": <MdSportsGolf />,
    "golf3": <FaGolfBall />,
    "golf4": <MdGolfCourse />,
    "tennis": <GiTennisBall />,
    "tennis2": <MdSportsTennis />,
    "tennis3": <GiTennisRacket />,
    "tennis4": <GiTennisCourt  />,
    // "tabletennis": <FontAwesomeIcon icon={faTableTennisPaddleBall} />,
    "stockcar": <IoCarSportSharp />,
    "stockcar2": <IoCarSportOutline />,
    "f1car": <GiF1Car />,
    "racingflag": <MdOutlineSportsScore />,
    "rugby": <MdSportsRugby />,
    "rugby2": <MdOutlineSportsRugby />,
    "cricket": <GiCricketBat />,
    "cricket2": <MdOutlineSportsCricket />,
    "motorsports": <MdSportsMotorsports />,
    "motorsports2": <GiFullMotorcycleHelmet />,
    "track": <FcSportsMode />,
    "olympics": <TbOlympics />,
    "volleyball": <LuVolleyball />,
    // "volleyball2": <MdOutlineSportsVolleyball />,
    "volleyball2": <PiVolleyballDuotone />,
    "volleyball3": <FontAwesomeIcon icon={faVolleyball} />,
    "wrestling": <MdOutlineSportsKabaddi />,
    "usercircle": <FaUserCircle />,
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
