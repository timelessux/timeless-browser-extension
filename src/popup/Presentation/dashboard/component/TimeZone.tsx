import moment from "moment-timezone";
import React, { useRef } from "react";
import useClickOutside from "../../hook/useClickOutside";
import { useSettingProvider } from "../../../context/SettingContext";
import { BsCheck } from "react-icons/bs";

type Props = {
  setIsShowTimezone: React.Dispatch<React.SetStateAction<boolean>>;
  isShowTimezone: boolean;
};

const TimeZone = ({ setIsShowTimezone, isShowTimezone }: Props) => {
  const timezoneRef = useRef<HTMLDivElement>(null);
  useClickOutside({ insideRef: timezoneRef, action: () => setIsShowTimezone(false) });
  const { timezone, setTimezone } = useSettingProvider();

  return (
    <div
      className={`position-absolute ${isShowTimezone ? "time-zone-active background-box" : ""}`}
      style={{
        left: -250,
        borderRadius: 10,
        margin: 10,
      }}
      ref={timezoneRef}
    >
      <div
        className="hidden-scroll-bar d-flex flex-column p-3"
        style={{
          overflow: "scroll",
          gap: 10,
          maxHeight: "25vh",
        }}
      >
        {moment.tz?.names().map((tz) => (
          <button
            className={`d-flex align-items-center justify-content-between gap-2 time-zone-button hover ${tz === timezone && "--active"
              }`}
            style={{
              borderRadius: 8,
              border: "none",
              backgroundColor: "transparent",
              color: "#fff",
            }}
            key={tz}
            onClick={() => {
              setTimezone(tz);
            }}
          >
            <div className="d-flex align-items-center justify-content-between w-100">
              <span className="chain-name align-middle">{tz}</span>
              {tz === timezone && (
                <div className="d-flex align-items-center">
                  <BsCheck color="greenyellow" size={18} />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeZone;
