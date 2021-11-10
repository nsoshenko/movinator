import { Link } from "react-router-dom";

const appTitle = "Movinator";
const appDescription =
  "Movinator is an application that will help you choose a movie to watch, based on your preferences.";

function Home() {
  return (
    <div className="container">
      <div className="title-container">{appTitle}</div>
      <div className="description-container">
        <div className="size-description-container">{appDescription}</div>
      </div>
      <div className="button-wrapper">
        <Link to="/question" id="start-link-wrapper">
          <button type="button" id="start-button">
            Start
          </button>
        </Link>
      </div>
      <div className="footer"></div>
    </div>
  );
}

export default Home;
