import React from "react";
import { numberFormatter } from "../../../../../utils/textConvert";

type Props = {
  replyCount: number;
  onClick?(): void
};

const TotalReply = ({ replyCount, onClick }: Props) => {
  return (
    <div className="total-reply cursor-pointer" onClick={onClick}>
      {numberFormatter(replyCount, 1)} {replyCount > 1 ? "Replies" : "Reply"}
    </div>
  );
};

export default TotalReply;
