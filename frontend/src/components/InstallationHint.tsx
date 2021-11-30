import { FC, FormEvent, useEffect, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";

type InstallationHintProps = {
  closeInstallationHintHandler: () => void;
};

const InstallationHint: FC<InstallationHintProps> = ({
  closeInstallationHintHandler,
}) => {
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia("(orientation: landscape)").matches
  );
  const [isChecked, setIsChecked] = useState(false);

  const desktopInstallIcon = <img src="/install.png" alt="install" />;
  const desktopManualText = [
    <li key="0">Add this app to your home screen for easy access</li>,
    <li key="1">
      The download button is on the right side of the address bar
    </li>,
    <li key="2">Click {desktopInstallIcon}, then "Install"</li>,
    <li key="3">An app shortcut will be created on the home screen</li>,
  ];

  const mobileInstallationIcon = <img src="/installMobile.png" alt="install" />;
  const mobileManualText = [
    <li key="0">Add this app to your home screen for easy access</li>,
    <li key="1">Click {mobileInstallationIcon}, then "Add to home screen"</li>,
    <li key="2">Enter the name for the shortcut and tap "Add"</li>,
    <li key="3">An app shortcut will be created on the home screen</li>,
  ];

  // Currently works only for mobile
  const handleOrientationChange = () => {
    const isPrevOrientationLandscape = window.matchMedia(
      "(orientation: landscape)"
    ).matches;
    isPrevOrientationLandscape ? setIsLandscape(false) : setIsLandscape(true);
  };

  useEffect(() => {
    window.addEventListener("orientationchange", handleOrientationChange);
    return () =>
      window.removeEventListener("orientationchange", handleOrientationChange);
  }, []);

  const okOnClickHandler = (e: FormEvent) => {
    e.preventDefault();
    if (isChecked) localStorage.setItem("neverShowInstallationHint", "true");
    closeInstallationHintHandler();
  };

  return (
    <div className="installationHint unselectable">
      {isLandscape && (
        <img
          className="closeButton"
          src="/close.png"
          alt="close"
          onClick={closeInstallationHintHandler}
        />
      )}
      <div className="contentWrapper">
        <ol>
          <BrowserView>{desktopManualText}</BrowserView>
          <MobileView>{mobileManualText}</MobileView>
        </ol>
        <form onSubmit={(e) => okOnClickHandler(e)}>
          <label htmlFor="remember">
            <input
              type="checkbox"
              name="remember"
              id="remember"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />{" "}
            I want to always use the app in browser
          </label>
          <button type="submit" className="circleButton">
            OK
          </button>
        </form>
      </div>
    </div>
  );
};

export default InstallationHint;
