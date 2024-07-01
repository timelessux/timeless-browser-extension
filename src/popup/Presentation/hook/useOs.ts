import { useEffect, useState } from "react";
import { EOs } from "../../../../ts";

export const useOs = () => {
  const [os, setOs] = useState<EOs>();

  useEffect(() => {
    function osfunction() {
      let os = navigator.userAgent;
      if (os.search("Windows") !== -1) {
        setOs(EOs.WINDOW);
      } else if (os.search("Mac") !== -1) {
        setOs(EOs.MACOS);
      } else if (os.search("X11") !== -1 && !(os.search("Linux") !== -1)) {
        setOs(EOs.UNIX);
      } else if (os.search("Linux") !== -1 && os.search("X11") !== -1) {
        setOs(EOs.LINUX);
      }
    }
    osfunction();
  }, []);

  return {
    os,
  };
};
