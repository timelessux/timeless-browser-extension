import React, { ReactNode, useState } from "react";
import TimeZoneSetting from "./TimeZoneSetting";
import { BsClockFill } from "react-icons/bs";
import { MdToken } from "react-icons/md";
import TokenSetting from "./TokenSetting";

enum EMenu {
  TIME_ZONE = "Time zone",
  TOKEN = "Token",
}

type Menu = {
  title: string;
  icon: ReactNode;
  type: EMenu;
};

const ListMenu: Menu[] = [
  { title: "Time zone", icon: <BsClockFill />, type: EMenu.TIME_ZONE },
  { title: "Token", icon: <MdToken />, type: EMenu.TOKEN },
];

const SettingView = () => {
  const [menuSellected, setMenuSellected] = useState<EMenu>(EMenu.TIME_ZONE);

  return (
    <div
      className="setting-page page col-12 fade-in"
      style={{ maxHeight: "100%", overflow: "hidden" }}
    >
      <div className="left-background col-3 h-100" />
      <div className="row gx-0 justify-content-between h-100">
        <div className="col-3 px-4 h-100 hidden-scroll-bar" style={{ overflow: "scroll" }}>
          <div className="text-center p-2" style={{ fontSize: 20, fontFamily: "Bold" }}>
            Menu
          </div>
          {ListMenu.map((menuItem) => (
            <MenuItem
              menuItem={menuItem}
              menuSellected={menuSellected}
              setMenuSellected={setMenuSellected}
              key={menuItem.type}
            />
          ))}
        </div>
        <div className="col-9 px-4 h-100" style={{ overflow: "hidden" }}>
          {menuSellected === EMenu.TIME_ZONE && <TimeZoneSetting />}
          {menuSellected === EMenu.TOKEN && <TokenSetting />}
        </div>
      </div>
    </div>
  );
};

export default SettingView;

const MenuItem = ({
  menuItem,
  menuSellected,
  setMenuSellected,
}: {
  menuItem: Menu;
  menuSellected: EMenu;
  setMenuSellected: React.Dispatch<React.SetStateAction<EMenu>>;
}) => {
  return (
    <div
      className={`p-2 hover d-flex align-items-center justify-content-between cursor-pointer menu-item rounded ${
        menuSellected === menuItem.type ? "opacity-1" : "opacity-50"
      }`}
      onClick={() => setMenuSellected(menuItem.type)}
      style={{ fontSize: 18, fontFamily: "Bold" }}
    >
      <div>{menuItem.title}</div>
      {menuItem.icon}
    </div>
  );
};
