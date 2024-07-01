import React from "react";
import { BiTransfer } from "react-icons/bi";

const MirrorInfor = ({
  ownerAddress,
  authorHandle,
}: {
  ownerAddress?: string;
  authorHandle: string;
}) => {
  return (
    <div className="mirrored d-flex align-items-center mb-2" style={{ opacity: 0.5 }}>
      <div className="me-1">
        <BiTransfer color="#fff" />
      </div>
      <div className="name-mirrored" style={{ fontSize: 13 }}>
        <span className="fw-bolder" onClick={(e) => e.stopPropagation()}>
          {authorHandle}
        </span>
        <span> mirrored</span>
      </div>
    </div>
  );
};

export default MirrorInfor;
