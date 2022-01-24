import { FC, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Divider from "../components/Divider";
import Header from "../components/Header";
import ModalWithButtons from "../components/ModalWithButtons";
import OptionBox from "../components/OptionBox";
import {
  isResultResponse,
  QuestionResponse,
  ResultResponse,
} from "../types/types";
import { getFirstQuestion, getNextQuestionOrResult } from "../adapters/api";
import {
  getCookieWithExpirationCheck,
  setCookieWithExpiration,
} from "../utils/cookies";

const Question: FC = () => {
  const imageUrl = "https://image.tmdb.org/t/p/w780";
  const history = useHistory();

  const [questionData, setQuestionData] = useState<QuestionResponse>();
  const [optionNames, setOptionNames] = useState<string[]>();
  const [optionPictures, setOptionPictures] = useState<string[]>(["", ""]);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const fetchQuestion = useCallback(
    async (sessionId?: string, answerData?: QuestionResponse) => {
      const processQuestionResponse = (response: QuestionResponse) => {
        setCookieWithExpiration(
          "sessionId",
          response.sessionId,
          1000 * 60 * 10
        );
        const question = response.question;
        const choosePlaceholderImage = (type: string) => {
          if (type === "cast")
            return `${type}_00${Math.ceil(Math.random() * 4)}.jpg`;
          return `${type}.jpg`;
        };
        setQuestionData(response);
        setOptionNames(question.options.map((option) => option.name));
        setOptionPictures(
          question.options.map((option) =>
            option.imageUrl
              ? imageUrl + option.imageUrl
              : `/placeholders/${choosePlaceholderImage(question.type)}`
          )
        );
      };

      try {
        if (!sessionId) {
          const response = await getFirstQuestion();
          const responseData = response.data as QuestionResponse;
          processQuestionResponse(responseData);
        } else {
          console.log(answerData);
          const response = await getNextQuestionOrResult(
            sessionId,
            answerData?.question
          );
          const responseData = response.data as unknown as
            | QuestionResponse
            | ResultResponse;
          if (isResultResponse(responseData)) history.push("result");
          else processQuestionResponse(responseData);
        }
      } catch (err) {
        console.log(err);
        setShowErrorModal(true);
      }
    },
    [history]
  );

  useEffect(() => {
    const sessionId = getCookieWithExpirationCheck("sessionId");
    fetchQuestion(sessionId);
  }, [fetchQuestion]);

  const sendAnswer = async (optionName: string): Promise<void> => {
    const answer = { ...questionData };
    const sessionId = getCookieWithExpirationCheck("sessionId");
    if (sessionId !== answer.sessionId) {
      localStorage.removeItem("sessionId");
      history.push("/");
    }
    if (answer) {
      for (const option of answer.question!.options) {
        if (option.name === optionName) option.selected = true;
      }
    }
    await fetchQuestion(answer.sessionId, answer as QuestionResponse);
  };

  return (
    <>
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
      <Header />
      <div className="container after-header">
        {optionNames && optionNames.length === 3 ? (
          <>
            <OptionBox
              backgroundUrl={optionPictures[0]}
              onClickHandler={sendAnswer}
            >
              {optionNames[0]}
            </OptionBox>
            <Divider onClickHandler={sendAnswer}>{optionNames[2]}</Divider>
            <OptionBox
              backgroundUrl={optionPictures[1]}
              onClickHandler={sendAnswer}
              id="ob2"
            >
              {optionNames[1]}
            </OptionBox>
          </>
        ) : (
          <div>No question was fetched</div>
        )}
      </div>
    </>
  );
};

export default Question;
