import { FC } from "react";
import { useHistory } from "react-router-dom";
import { closeSession } from "../utils/api";
import { getCookieWithExpirationCheck } from "../utils/cookies";

const Header: FC = () => {
  const history = useHistory();

  const handleHomeClick = async () => {
    const sessionId = getCookieWithExpirationCheck("sessionId");
    if (sessionId) {
      try {
        await closeSession(sessionId);
      } finally {
        localStorage.removeItem("sessionId");
        history.push("/");
      }
    }
  };
  return (
    <header>
      <img
        className="home-button"
        src={process.env.PUBLIC_URL + "/home.png"}
        alt="home"
        onClick={handleHomeClick}
      ></img>
      Movinator
    </header>
  );
};

export default Header;
