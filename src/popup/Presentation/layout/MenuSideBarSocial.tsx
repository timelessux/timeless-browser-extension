import React from "react";
import { IoHomeOutline, IoSearch } from "react-icons/io5";
import MenuItemSocial from "./component/MenuItemSocial";
import { NotificationDotIcon } from "../../assets/icons/notificationDotIcon";
import { FiBookmark, FiSettings } from "react-icons/fi";

type Props = { isExpanded: boolean };

const MenuSideBarSocial = ({ isExpanded }: Props) => {
  return (
    <div
      className={`menu-side-bar-social fade-in flex-column justify-content-between align-items-center align-items-center ${
        isExpanded ? "" : "--expanded"
      }`}
    >
      <div className="group-items d-flex flex-column gap-3">
        <MenuItemSocial icon={<IoHomeOutline size={24} />} isActive={true} />
        <MenuItemSocial icon={<IoSearch size={24} />} isActive={false} />
        <MenuItemSocial
          icon={<NotificationDotIcon isNewNoti color="#fff" dotColor="#fff" />}
          isActive={false}
        />
        <MenuItemSocial icon={<FiBookmark size={24} />} isActive={false} />
        <MenuItemSocial icon={<FiSettings size={24} />} isActive={false} />
      </div>
    </div>
  );
};

export default MenuSideBarSocial;
