import React from "react";
import { useAppSelector } from "../../redux/hook";
import StashItem from "./StashItem";

type Props = {
  setStateBox: () => void;
};

const ListStash = ({ setStateBox }: Props) => {
  const dataStashWindow = useAppSelector((state) => state.stash.dataStashWindow);

  return (
    <div>
      {dataStashWindow.map((s) => (
        <StashItem stashWindow={s} key={s.uniqueId} setStateBox={setStateBox} />
      ))}
    </div>
  );
};

export default ListStash;
