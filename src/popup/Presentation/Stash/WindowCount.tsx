import React from "react";
import { numberFormatter } from "../../../../utils/textConvert";
import { StashWindow } from "../../redux/slices/stash/stash.slice";

const WindowCount = ({ session }: { session: StashWindow }) => {
  return (
    <div className="tab-count">
      {numberFormatter(session.stash.length, 1)} {session.stash.length > 1 ? "windows" : "window"}
    </div>
  );
};

export default WindowCount;
