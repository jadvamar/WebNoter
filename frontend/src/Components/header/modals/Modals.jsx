// Modals.js
import Login from "../../Auth/Login/Login";
import Signup from "../../Auth/Signup/Signup";
import css from "./Modals.css";

const Modals = ({ auth }) => {
  return (
    <div className={css.modals}>
      {auth?.login && <Login />}
      {auth?.signup && <Signup />}
    </div>
  );
};

export default Modals;
