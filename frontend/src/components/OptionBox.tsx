import { FC } from "react";

type OptionBoxProps = {
  // id: string;
  backgroundUrl: string;
  onClickHandler: (value: string) => Promise<void>;
  children: string;
};

const OptionBox: FC<OptionBoxProps> = ({
  backgroundUrl,
  onClickHandler,
  children,
}) => {
  const handleClick = (): void => {
    onClickHandler(children);
  };

  return (
    <div
      className="option-box"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
      onClick={handleClick}
    >
      <div className="text-container unselectable">{children}</div>
    </div>
  );
};

export default OptionBox;
