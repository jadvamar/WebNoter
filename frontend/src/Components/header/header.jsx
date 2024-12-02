import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Contexts/UserContext";
import menuBar from "../../images/image.png";
import downArrow from "../../images/down-arrow.png";
import profilePic from "../../images/image.png";
import Login from "../Auth/Login/Login";
import Signup from "../Auth/Signup/Signup";
import css from "./header.module.css";

import pro from "../../images/pro.png";

const NavigationBar = () => {
  const { user, logoutUser } = useContext(UserContext);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [auth, setAuth] = useState({
    closed: true,
    login: false,
    signup: false,
  });

  const handleLoginClick = () => {
    setAuth({ closed: false, login: true, signup: false });
  };

  const handleSignupClick = () => {
    setAuth({ closed: false, login: false, signup: true });
  };

  const closeAuthModal = () => {
    setAuth({ closed: true, login: false, signup: false });
  };

  return (
    <div className={css.navbar}>
      <img
        className={css.menuBar}
        src={menuBar}
        alt="menu bar"
        onClick={() => setMenuDisplay((val) => !val)}
      />
      <div className={css.navbarInner}>
        <div className={css.leftSide}>
          <Link to="/" className={css.appTxt}>
            WebNoter
          </Link>
        </div>
        <div className={css.rightSide}>
          {user ? (
            <div className={css.menuItem}>
              <div
                className={css.profile}
                onClick={() => setMenuDisplay((val) => !val)}
              >
                <span>{user.name}</span>
                <img src={pro} alt="profile pic" className={css.profilePic} />
                <img src={downArrow} alt="arrow" className={css.arrow} />
              </div>
              <div
                className={css.menu}
                style={{ display: menuDisplay ? "block" : "none" }}
              >
                <div
                  className={css.menuItemLinkTxt}
                  onClick={() => {
                    logoutUser();
                    setMenuDisplay(false); // Close menu after logout
                  }}
                >
                  <div className={css.menuItemLink}>Logout</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={css.menuItem} onClick={handleLoginClick}>
                Log in
              </div>
              <div className={css.menuItem} onClick={handleSignupClick}>
                Sign up
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className={css.modals}
        style={{ display: auth.closed ? "none" : "flex" }}
      >
        {auth.login && <Login onClose={closeAuthModal} />}
        {auth.signup && <Signup onClose={closeAuthModal} />}
      </div>
    </div>
  );
};

export default NavigationBar;
