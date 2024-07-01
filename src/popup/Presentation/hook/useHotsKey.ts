import { useCallback, useEffect } from "react";

const useHotsKey = ({ action }: { action: () => void }) => {
  const handleKeyDown = useCallback((event) => {
    if (event.ctrlKey || (event.metaKey && (event.key === "K" || event.key === "k"))) {
      event.preventDefault();
      action();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return handleKeyDown;
};

export default useHotsKey;
