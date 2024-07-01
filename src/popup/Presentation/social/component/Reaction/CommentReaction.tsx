import React from "react";
import { FaRegComment } from "react-icons/fa";
import { numberFormatter } from "../../../../../../utils/textConvert";

type Props = {
  commentCount: number;
  onClick(): void;
};

const CommentReaction = ({ commentCount, onClick }: Props) => {
  return (
    <div
      className="comment-reaction cursor-pointer"
      onClick={(e) => {
        e.stopPropagation(), onClick();
      }}
    >
      <span>
        <FaRegComment size={18} />
      </span>
      <span className="counter align-middle ms-2">{numberFormatter(commentCount, 1)}</span>
    </div>
  );
};

export default CommentReaction;
