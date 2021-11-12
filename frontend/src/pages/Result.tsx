import axios from "axios";
import { FC, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import { MovieDetails, ResultResponse } from "../types/types";
import { getCookieWithExpirationCheck } from "../utils/cookies";

const Result: FC = () => {
  const apiUrl = "http://192.168.0.100:3002/api/question";
  const imageUrl = "https://image.tmdb.org/t/p/w1280";
  const history = useHistory();
  const screen = window.screen;

  const [result, setResult] = useState<MovieDetails>();

  const fetchResult = useCallback(async (sessionId: string) => {
    const response = await axios.post(apiUrl, { sessionId: sessionId });
    const responseData = response.data as unknown as ResultResponse;
    setResult(responseData.result);
  }, []);

  const choosePlaceholderPicture = (): string =>
    `/placeholders/movies_00${Math.ceil(Math.random() * 4)}.jpg`;

  const calculateTitleFontSize = (title: string): string => {
    const measureUnits =
      screen.orientation.type === ("landscape-primary" || "landscape-secondary")
        ? "vw"
        : "vh";

    if (title.length <= 10) return 7.5 + measureUnits;
    if (title.length <= 30) return 3.5 + measureUnits;
    return 2 + measureUnits;
  };

  useEffect(() => {
    const sessionId = getCookieWithExpirationCheck("sessionId");
    if (sessionId) fetchResult(sessionId);
    else history.push("/");
  }, [fetchResult, history]);

  return (
    <>
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
                <h2 className="text-margin-top">
                  TMDB: {result.vote_average} ({result?.vote_count})
                </h2>
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
                  >
                    {result.title}
                  </span>
                  <h2 className="text-margin-top">
                    {new Date(result.release_date).getFullYear()} |
                    {Math.floor(result.runtime / 60)}h {result.runtime % 60}m
                    {result.tagline.length > 0 && "|"} {result.tagline}
                  </h2>
                  <h2 className="text-margin-top">
                    TMDB: {result.vote_average} ({result.vote_count})
                  </h2>
                </div>
                <div className="cast-wrapper">
                  <p className="text-margin-top">
                    Director: Carey Joji Fukunaga
                  </p>
                  <p className="text-margin-top">
                    Cast of actors:{" "}
                    {result.cast.slice(0, 10).map((item, index, arr) => {
                      return index !== arr.length - 1 ? `${item}, ` : `${item}`;
                    })}
                  </p>
                </div>
              </div>
              <div className="description-container">
                <div className="description-text-wrapper">
                  <p>{result.overview}</p>
                </div>
                <div className="button-container">
                  <div className="button-label">Similar movie</div>
                  <button id="similar-button"></button>
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
