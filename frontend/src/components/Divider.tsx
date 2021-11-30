import { FC } from "react";

type DividerProps = {
  onClickHandler: (value: string) => Promise<void>;
  children: string;
};

const Divider: FC<DividerProps> = ({ children, onClickHandler }) => {
  const handleClick = (): void => {
    onClickHandler(children);
  };
  return (
    <div className="divider">
      <button className="circleButton" id="other-button" onClick={handleClick}>
        {children}
      </button>
    </div>
  );
};

export default Divider;
