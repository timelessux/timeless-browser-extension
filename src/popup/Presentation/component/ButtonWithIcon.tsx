import React, { ReactNode } from "react";

const ButtonWithIcon = ({
  title,
  onClick,
  icon,
  className,
  visibleTitle,
  disabled,
}: {
  title?: string;
  onClick?: () => void;
  icon: ReactNode;
  className?: string;
  visibleTitle: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      className={`
        ${className ? className : ""} 
        button-with-icon d-flex align-items-center justify-content-center
        ${disabled ? "disable" : ""}
      `}
      onClick={(e) => { 
        e.stopPropagation()
        onClick && onClick() 
      }}
      disabled={disabled}
    >
      <React.Fragment>{icon}</React.Fragment>
      {title && visibleTitle && <span className="align-middle ms-2">{title}</span>}
    </button>
  );
};

export default ButtonWithIcon;
