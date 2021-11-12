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
      <div
        className="home-button"
        style={{ backgroundImage: "url(/home.png)" }}
        onClick={handleClick}
      ></div>
      Movinator
    </header>
  );
};

export default Header;
