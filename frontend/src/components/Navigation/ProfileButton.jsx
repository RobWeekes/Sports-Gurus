import { FaCarrot } from 'react-icons/fa6';
import { MdSportsFootball, MdOutlineSportsFootball, MdOutlineSportsBasketball, MdOutlineSportsBaseball, MdSportsBaseball, MdSportsHockey, MdSportsSoccer } from "react-icons/md";


function ProfileButton() {
  const Carrot = () => {
    return (
      <div style={{ color: "orange", fontSize: "100px" }}>
        <FaCarrot />
        <MdOutlineSportsFootball />
        <MdSportsFootball />
        <MdOutlineSportsBasketball />
        <MdOutlineSportsBaseball />
        <MdSportsBaseball />
        <MdSportsHockey />
        <MdSportsSoccer />
      </div>
    );
  };
}


export default ProfileButton;
