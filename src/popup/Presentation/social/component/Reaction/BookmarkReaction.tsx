import React from "react";
import { numberFormatter } from "../../../../../../utils/textConvert";
import { IoBookmarkOutline } from "react-icons/io5";

type Props = {};

const BookmarkReaction = () => {
  return (
    <div className="share-reaction cursor-pointer">
      <span>
        <IoBookmarkOutline size={18} />
      </span>
    </div>
  );
};

export default BookmarkReaction;
