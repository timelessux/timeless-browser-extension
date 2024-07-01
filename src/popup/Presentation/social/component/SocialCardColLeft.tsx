import React from "react";
import { Publication } from "../../../Domain/Model/Publication";
import { reformatToValidLink } from "../../../../../utils/link";
import Avatar from "../../component/Avatar";
import avt1 from "../../../assets/icons/avt1.png";
import avt2 from "../../../assets/icons/avt2.png";

const SocialCardColLeft = ({
  post,
  showBorder = true,
}: {
  post: Publication;
  showBorder?: boolean;
}) => {
  return (
    <div className="d-flex flex-column justify-content-between gap-1 pt-4 row-image">
      <Avatar
        size={48}
        radius={"50%"}
        src={reformatToValidLink(post.profile?.avatar)}
        alt={post.profile?.handle}
      />
      {showBorder && <div className="border-image ms-auto me-auto flex-fill" />}
      {showBorder && (
        <div className="group-avatar d-flex">
          <Avatar size={30} radius={"50%"} src={avt1} />
          <Avatar size={30} radius={"50%"} src={avt2} />
        </div>
      )}
    </div>
  );
};

export default SocialCardColLeft;
