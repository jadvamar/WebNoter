// UserMenu.js
import { useState } from "react";
import { Link } from "react-router-dom";
import downArrow from "../../../images/down-arrow.png";
import profilePic from "../../../images/image.png";
import css from "./usermenu.css";

const UserMenu = ({ loggedIn }) => {
  const [menuDisplay, setMenuDisplay] = useState(false);
  const userRole = "company"; // Placeholder for user role, replace with prop/context

  return (
    <div className={css.menuItem}>
      <div
        className={css.profile}
        onClick={() => setMenuDisplay((val) => !val)}
      >
        <img src={profilePic} alt="profile pic" className={css.profilePic} />
        <div className={css.profileName}>Username</div>
        <img src={downArrow} alt="arrow" className={css.arrow} />
      </div>
      <div className={css.menu} style={{ display: menuDisplay ? "block" : "" }}>
        <Link to="/user/reviews" className={css.menuItemLinkTxt}>
          <div className={css.menuItemLink}>History</div>
        </Link>
        {userRole === "company" && (
          <Link to="/dashboard" className={css.menuItemLinkTxt}>
            <div className={css.menuItemLink}>Dashboard</div>
          </Link>
        )}
        <div className={css.menuItemLinkTxt}>
          <div className={css.menuItemLink}>Logout</div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
