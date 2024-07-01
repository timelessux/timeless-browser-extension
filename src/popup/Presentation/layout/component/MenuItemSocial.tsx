import React, { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  isActive: boolean;
};

const MenuItemSocial = ({ icon, isActive }: Props) => {
  return (
    <div
      className={`menu-item-social d-flex align-items-center justify-content-center position-relative ${isActive ? "--active" : "opacity-50"}`}
    >
      <div className="icon d-flex align-items-center justify-content-center">{icon}</div>
    </div>
  );
};

export default MenuItemSocial;
