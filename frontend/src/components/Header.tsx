import { FC } from "react";
import { useHistory } from "react-router-dom";

const Header: FC = () => {
  const history = useHistory();

  const handleClick = (): void => {
    localStorage.removeItem("sessionId");
    history.push("/");
  };
  return (
    <header>
      <img
        className="home-button"
        src="/home.png"
        alt="home"
        onClick={handleClick}
      ></img>
      Movinator
    </header>
  );
};

export default Header;
