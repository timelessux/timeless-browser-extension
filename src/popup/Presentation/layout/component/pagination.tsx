import React from "react";
import { DotIcon } from "../../../assets/icons/dotIcon";
import { SlideIcon } from "../../../assets/icons/slideIcon";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { setVisibleMenuSideBar } from "../../../redux/slices/slide/slide.slice";
import { EPage } from "../../../../../ts";

type Props = {
  setMoveY: React.Dispatch<React.SetStateAction<number>>;
  hasToken: boolean;
  setPage: React.Dispatch<React.SetStateAction<EPage>>;
};

const Pagination = ({ setMoveY, hasToken, setPage }: Props) => {
  const dispatch = useAppDispatch();
  const isVisibleMenuSideBar = useAppSelector((state) => state.slide.isVisibleMenuSideBar);
  const isLock = useAppSelector((state) => state.wallet.isLock);

  return (
    <div className="pagination gap-3">
      <div
        className="dot cursor-pointer"
        onClick={() => {
          dispatch(setVisibleMenuSideBar({ isVisibleMenuSideBar: false }));
          setMoveY(100);
          setPage(EPage.DEFAULT);
        }}
      >
        <DotIcon opacity={isVisibleMenuSideBar ? 0.3 : 1} />
      </div>
      <div
        className="slide cursor-pointer"
        onClick={() => {
          dispatch(setVisibleMenuSideBar({ isVisibleMenuSideBar: true }));
          setMoveY(0);
          if (isLock || !hasToken) {
            setPage(EPage.PASSWORD);
          } else {
            setPage(EPage.COLLECTION);
          }
        }}
      >
        <SlideIcon opacity={isVisibleMenuSideBar ? 1 : 0.3} />
      </div>
    </div>
  );
};

export default Pagination;
