import { Switch } from "antd";
import React, { useState } from "react";
import { useSettingProvider } from "../../context/SettingContext";
import ListTimeZone from "./ListTimeZone";
import { ArrowDownCircleIcon } from "../../assets/icons/arrowDownCircle";

const TimeZoneSetting = () => {
  const { currentTime, setMilitaryFormat, militaryFormat } = useSettingProvider();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="time-zone-setting-view fade-in d-flex flex-column h-100">
      <div className="setting-item d-flex justify-content-between align-items-center p-2">
        <div>Military clock (24-hour)</div>
        <Switch
          checked={militaryFormat}
          onChange={() => {
            setMilitaryFormat(!militaryFormat);
          }}
        />
      </div>
      <div className="setting-item mt-2 d-flex flex-column" style={{ flex: 1, overflow: "hidden" }}>
        <div
          onClick={() => {
            setOpen(!open);
          }}
          className="d-flex align-items-center justify-content-between px-2"
        >
          <div>Current time zone is: {currentTime._z?.name || "Your location"}</div>
          <div className={`${open ? "rotation-0" : "rotation-270"}`}>
            <ArrowDownCircleIcon />
          </div>
        </div>
        <ListTimeZone setOpen={setOpen} open={open} />
      </div>
    </div>
  );
};

export default TimeZoneSetting;
