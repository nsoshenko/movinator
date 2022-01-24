import { FC, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { isIOS } from "react-device-detect";
import InstallationHint from "../components/InstallationHint";
import ModalWithButtons from "../components/ModalWithButtons";
import { SessionStageResponse } from "../types/types";
import { checkSession } from "../adapters/api";
import { getCookieWithExpirationCheck } from "../utils/cookies";

const Home: FC = () => {
  const history = useHistory();

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [showInstallationHint, setShowInstallationHint] = useState(false);

  useEffect(() => {
    // Check session to trigger session modal if needed
    const checkExistingSession = async () => {
      const sessionId = getCookieWithExpirationCheck("sessionId");
      if (sessionId) {
        try {
          const response = await checkSession(sessionId);
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

    // Check device to trigger install hint if needed
    const neverShowInstallationHint = getCookieWithExpirationCheck(
      "neverShowInstallationHint"
    );
    if (isIOS) {
      const installed = window.matchMedia("(display-mode: standalone)").matches;
      if (!installed && !neverShowInstallationHint)
        setShowInstallationHint(true);
    } else {
      window.addEventListener("beforeinstallprompt", () => {
        if (!getCookieWithExpirationCheck("neverShowInstallationHint"))
          setShowInstallationHint(true);
      });
    }
  }, []);

  const appTitle = "Movinator";
  const appDescription =
    "Movinator is an application that helps you choose a movie to watch, based on your preferences";

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

  const closeInstallationHintHandler = () => {
    setShowInstallationHint(false);
  };

  const startOnClick = () => redirectHandler("/question");

  return (
    <>
      {showSessionModal && (
        <ModalWithButtons
          modalText="Want to continue your last session?"
          buttons={[
            {
              text: "Yes",
              onClickHandler: yesOnClickHandler,
            },
            {
              text: "No",
              onClickHandler: noOnClickHandler,
            },
          ]}
        />
      )}
      {showInstallationHint && (
        <InstallationHint
          closeInstallationHintHandler={closeInstallationHintHandler}
        />
      )}
      <div
        className="container flex-column with-image-background unselectable"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
            process.env.PUBLIC_URL + "/home_background_2.jpg"
          })`,
        }}
      >
        <div className="title-wrapper">{appTitle}</div>
        <div className="description-wrapper">
          <div className="size-description-wrapper">{appDescription}</div>
        </div>
        <div className="start-button-wrapper">
          <button type="button" id="start-button" onClick={startOnClick}>
            Start
          </button>
        </div>
      </div>
      <div className="footer"></div>
    </>
  );
};

export default Home;
