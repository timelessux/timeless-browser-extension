import React from "react";
import { numberFormatter } from "../../../../../utils/textConvert";

type Props = {
  likeCount: number;
};

const TotalLike = ({ likeCount }: Props) => {
  return (
    <div className="total-like">
      {numberFormatter(likeCount, 1)} {likeCount > 1 ? "Likes" : "Like"}
    </div>
  );
};

export default TotalLike;
