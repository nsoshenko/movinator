import { FC } from "react";

type OptionBoxProps = {
  backgroundUrl: string;
  onClickHandler: (value: string) => Promise<void>;
  children: string;
  id?: string;
};

const OptionBox: FC<OptionBoxProps> = ({
  backgroundUrl,
  onClickHandler,
  children,
  id,
}) => {
  const handleClick = (): void => {
    onClickHandler(children);
  };

  return (
    <div
      className="option-box"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
      onClick={handleClick}
      id={id}
    >
      <div className="text-container unselectable">{children}</div>
    </div>
  );
};

export default OptionBox;
