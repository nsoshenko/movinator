import axios from "axios";
import { FC, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import ModalWithButtons from "../components/ModalWithButtons";
import { MovieDetails, QuestionResponse, ResultResponse } from "../types/types";
import { movinatorApiUrl } from "../utils/api";
import {
  getCookieWithExpirationCheck,
  setCookieWithExpiration,
} from "../utils/cookies";

const Result: FC = () => {
  const imageUrl = "https://image.tmdb.org/t/p/w1280";
  const history = useHistory();

  const [result, setResult] = useState<MovieDetails>();
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const fetchResult = useCallback(
    async (sessionId: string) => {
      try {
        const response = await axios.post(movinatorApiUrl + "/question", {
          sessionId: sessionId,
        });
        const responseData = response.data as unknown as ResultResponse;
        setCookieWithExpiration(
          "sessionId",
          responseData.sessionId,
          1000 * 60 * 10
        );
        if ((responseData as unknown as QuestionResponse).question)
          history.push("/question");
        setResult(responseData.result);
      } catch (err) {
        console.log(err);
        setShowErrorModal(true);
      }
    },
    [history]
  );

  // Refactor it for DRY, please
  const fetchSimilarMovie = useCallback(async (sessionId: string) => {
    try {
      const response = await axios.post(movinatorApiUrl + "/similar", {
        sessionId: sessionId,
      });
      const responseData = response.data as unknown as ResultResponse;
      setCookieWithExpiration(
        "sessionId",
        responseData.sessionId,
        1000 * 60 * 10
      );
      setResult(responseData.result);
    } catch {
      setShowSuggestionModal(true);
    }
  }, []);

  const handleSimilarMoviesClick = (): void => {
    const sessionId = getCookieWithExpirationCheck("sessionId");
    if (sessionId) fetchSimilarMovie(sessionId);
    else setShowErrorModal(true);
  };

  const yesOnClickHandler = (): void => {
    localStorage.removeItem("sessionId");
    history.push("/question");
  };

  const noOnClickHandler = (): void => setShowSuggestionModal(false);

  const choosePlaceholderPicture = (): string =>
    process.env.PUBLIC_URL +
    `/placeholders/movies_00${Math.ceil(Math.random() * 4)}.jpg`;

  const calculateTitleFontSize = (title: string): string => {
    // const screenOrientation = window.matchMedia("(orientation: landscape)");
    // const measureUnits = screenOrientation.matches ? "vw" : "vh";

    if (title.length <= 10) return 7.5 + "vmax";
    if (title.length <= 30) return 3.5 + "vmax";
    return 2 + "vmax";
  };

  useEffect(() => {
    const sessionId = getCookieWithExpirationCheck("sessionId");
    if (sessionId) fetchResult(sessionId);
    else history.push("/");
  }, [fetchResult, history]);

  return (
    <>
      {showSuggestionModal && (
        <ModalWithButtons
          modalText={[
            "No similar movies left",
            "Would you like to start a new session?",
          ]}
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
      {showErrorModal && (
        <ModalWithButtons
          modalText={[
            "Something went wrong",
            "You will be redirected to the homepage",
          ]}
          buttons={[
            {
              text: "OK",
              onClickHandler: () => history.push("/"),
            },
          ]}
        />
      )}
      {result && (
        <>
          <Header />
          <div className="container flex-column-reverse after-header">
            <div
              className="image-container"
              style={
                result.backdrop_path
                  ? {
                      backgroundImage: `url(${
                        imageUrl + result.backdrop_path
                      })`,
                    }
                  : {
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${choosePlaceholderPicture()}')`,
                    }
              }
            >
              <div className="image-title-info-wrapper">
                <span
                  style={{
                    fontSize: `${calculateTitleFontSize(result.title)}`,
                  }}
                  className="title"
                >
                  {result.title}
                </span>{" "}
                <h2 className="text-margin-top">
                  {new Date(result.release_date).getFullYear()} |
                  {Math.floor(result.runtime / 60)}h {result.runtime % 60}m |{" "}
                  {result.tagline}
                </h2>
                {result.vote_count > 0 && (
                  <h2 className="text-margin-top">
                    TMDB: {result.vote_average} ({result.vote_count})
                  </h2>
                )}
              </div>
            </div>
            <div className="bottom-box">
              <div className="info-container">
                <div className="bottom-title-info-wrapper">
                  <span
                    style={{
                      fontSize: `${calculateTitleFontSize(result.title)}`,
                    }}
                    className="title"
                    onClick={() => navigator.clipboard.writeText(result.title)}
                  >
                    {result.title}
                  </span>
                  <h2 className="text-margin-top">
                    {new Date(result.release_date).getFullYear()} |
                    {Math.floor(result.runtime / 60)}h {result.runtime % 60}m
                    {result.tagline.length > 0 && "|"} {result.tagline}
                  </h2>
                  {result.vote_count > 0 && (
                    <h2 className="text-margin-top">
                      TMDB: {result.vote_average} ({result.vote_count})
                    </h2>
                  )}
                </div>
                <div className="cast-wrapper">
                  {result.director && (
                    <p className="text-margin-top">
                      Director: {result.director}
                    </p>
                  )}
                  {result.cast.length > 0 && (
                    <p className="text-margin-top">
                      Cast of actors:{" "}
                      {result.cast.slice(0, 10).map((item, index, arr) => {
                        return index !== arr.length - 1
                          ? `${item}, `
                          : `${item}`;
                      })}
                    </p>
                  )}
                </div>
              </div>
              <div className="description-container">
                <div className="description-text-wrapper">
                  <p>{result.overview}</p>
                </div>
                <div className="button-container">
                  <div className="button-label">Similar movie</div>
                  <button
                    id="similar-button"
                    onClick={handleSimilarMoviesClick}
                  ></button>
                </div>
              </div>
            </div>
          </div>{" "}
        </>
      )}
    </>
  );
};

export default Result;
