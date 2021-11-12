import axios from "axios";
import { FC, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Divider from "../components/Divider";
import Header from "../components/Header";
import OptionBox from "../components/OptionBox";
import {
  isResultResponse,
  QuestionResponse,
  ResultResponse,
} from "../types/types";
import {
  getCookieWithExpirationCheck,
  setCookieWithExpiration,
} from "../utils/cookies";

const Question: FC = () => {
  const apiUrl = "http://192.168.0.100:3002/api/question";
  const imageUrl = "https://image.tmdb.org/t/p/w1280";
  const history = useHistory();

  const [questionData, setQuestionData] = useState<QuestionResponse>();
  const [optionNames, setOptionNames] = useState<string[]>();
  const [optionPictures, setOptionPictures] = useState<string[]>(["", ""]);

  const fetchQuestion = useCallback(
    async (sessionId?: string, answerData?: QuestionResponse) => {
      const processQuestionResponse = (response: QuestionResponse) => {
        setCookieWithExpiration("sessionId", response.sessionId, 1000 * 60);
        const question = response.question;
        setQuestionData(response);
        setOptionNames(question.options.map((option) => option.name));
        setOptionPictures(
          question.options.map((option) =>
            option.imageUrl
              ? imageUrl + option.imageUrl
              : `/placeholders/${question.type}_00${Math.ceil(
                  Math.random() * 4
                )}.jpg`
          )
        );
      };

      if (!sessionId) {
        const response = await axios.get(apiUrl);
        const responseData = response.data as QuestionResponse;
        processQuestionResponse(responseData);
      } else {
        console.log(answerData);
        const response = await axios.post(apiUrl, {
          sessionId: sessionId,
          question: answerData?.question,
        });
        const responseData = response.data as unknown as
          | QuestionResponse
          | ResultResponse;
        if (isResultResponse(responseData)) history.push("result");
        else processQuestionResponse(responseData);
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
    if (sessionId !== answer.sessionId) throw Error("Session IDs discrepancy");
    if (answer) {
      for (const option of answer.question!.options) {
        if (option.name === optionName) option.selected = true;
      }
    }
    await fetchQuestion(answer.sessionId, answer as QuestionResponse);
  };

  return (
    <>
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
