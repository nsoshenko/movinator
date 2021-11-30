import { FC } from "react";

type SessionModalProps = {
  yesOnClickHandler: () => void;
  noOnClickHandler: () => void;
};

const SessionModal: FC<SessionModalProps> = ({
  yesOnClickHandler,
  noOnClickHandler,
}) => {
  return (
    <div className="sessionModal unselectable">
      <div className="sessionModalContent">
        <img src="/clapperboard.png" alt="clapperboardIcon" />
        <p>Want to continue your last session?</p>
        <div className="yesNoWrapper">
          <button id="yesButtonSessionModal" onClick={yesOnClickHandler}>
            Yes
          </button>
          <button id="noButtonSessionModal" onClick={noOnClickHandler}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;
