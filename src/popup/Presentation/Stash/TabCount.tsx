import React, { useEffect, useState } from "react";
import { numberFormatter } from "../../../../utils/textConvert";
import { StashWindow } from "../../redux/slices/stash/stash.slice";

const TabCount = ({ session }: { session: StashWindow }) => {
  const [tabCount, setTabCount] = useState<number>(0);

  useEffect(() => {
    let count = 0;
    session.stash.map((s) => {
      count += s.tabs.length;
    });

    setTabCount(count);
  }, [session]);

  return (
    <div className="tab-count">
      {numberFormatter(tabCount, 1)} {tabCount > 1 ? "tabs" : "tab"}
    </div>
  );
};

export default TabCount;
