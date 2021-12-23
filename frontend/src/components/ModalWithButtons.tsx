import { FC } from "react";

// type SessionModalProps = {
//   yesOnClickHandler: () => void;
//   noOnClickHandler: () => void;
// };

type ModalButton = {
  text: string;
  onClickHandler: () => void;
};

type SessionModalProps = {
  modalText: string | string[];
  buttons: ModalButton[];
};

const SessionModal: FC<SessionModalProps> = ({ modalText, buttons }) => {
  return (
    <div className="sessionModal unselectable">
      <div className="sessionModalContent">
        <img src="/clapperboard.png" alt="clapperboardIcon" />
        {typeof modalText === "string" ? (
          <p>{modalText}</p>
        ) : (
          modalText.map((item, index) => (
            <p key={index} style={{ marginTop: index > 0 ? 0 : undefined }}>
              {item}
            </p>
          ))
        )}
        <div className="buttonsWrapper">
          {buttons.map((button, index) => (
            <button
              key={index}
              id={`${button.text}ButtonSessionModal`}
              onClick={button.onClickHandler}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionModal;
