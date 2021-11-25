import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SessionModal from "../components/SessionModal";
import { SessionStageResponse } from "../types/types";
import { movinatorApiUrl } from "../utils/api";
import { getCookieWithExpirationCheck } from "../utils/cookies";

const Home: FC = () => {
  const history = useHistory();

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  useEffect(() => {
    const checkExistingSession = async () => {
      const sessionId = getCookieWithExpirationCheck("sessionId");
      if (sessionId) {
        try {
          const response = await axios.post(movinatorApiUrl + "/check", {
            sessionId: sessionId,
          });
          if (response.status === 200) {
            setShowSessionModal(true);
            const sessionData = response.data as SessionStageResponse;
            if (sessionData) {
              if (sessionData.finished) setIsSessionFinished(true);
            }
          }
        } catch (err) {
          console.error(err);
          console.log("Removing session cookie as expired");
          localStorage.removeItem("sessionId");
        }
      }
    };
    checkExistingSession();
  }, []);

  const appTitle = "Movinator";
  const appDescription =
    "Movinator is an application that will help you choose a movie to watch, based on your preferences.";

  const redirectHandler = (route: "/question" | "/result") => {
    history.push(route);
  };

  const yesOnClickHandler = () =>
    isSessionFinished
      ? redirectHandler("/result")
      : redirectHandler("/question");

  const noOnClickHandler = () => {
    localStorage.removeItem("sessionId");
    setShowSessionModal(false);
  };

  const startOnClick = () => redirectHandler("/question");

  return (
    <>
      {showSessionModal && (
        <SessionModal
          yesOnClickHandler={yesOnClickHandler}
          noOnClickHandler={noOnClickHandler}
        />
      )}
      <div
        className="container flex-column with-image-background"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/home_background.jpeg')",
        }}
      >
        <div className="title-wrapper unselectable">{appTitle}</div>
        <div className="description-wrapper">
          <div className="size-description-wrapper unselectable">
            {appDescription}
          </div>
        </div>
        <div className="start-button-wrapper">
          <button type="button" id="start-button" onClick={startOnClick}>
            Start
          </button>
        </div>
        <div className="footer"></div>
      </div>
    </>
  );
};

export default Home;
