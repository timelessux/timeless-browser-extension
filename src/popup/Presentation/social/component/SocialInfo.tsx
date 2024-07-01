import React from "react";
import { reformatDateFromNow } from "../../../../../utils/date";
import { Publication } from "../../../Domain/Model/Publication";
import { BsDot } from "react-icons/bs";

const SocialInfo = ({ post }: { post: Publication }) => {
  return (
    <div className="info">
      <span className="name">{post.profile?.name ?? post.profile?.handle ?? post.profile?.id}</span>
      {post.authorHandle && <span className="ms-1 handle">@{post.authorHandle}</span>}
      <BsDot size={20} color="#ffffff80" />
      {post.updatedAt ||
        (post.createdAt && (
          <span className="time-post">
            {reformatDateFromNow(post.updatedAt || post.createdAt)}
          </span>
        ))}
    </div>
  );
};

export default SocialInfo;
