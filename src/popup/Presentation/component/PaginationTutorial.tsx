import React from "react";
import { useAppSelector } from "../../redux/hook";

const PaginationTutorial = () => {
  const { stepSellected, pagination } = useAppSelector((state) => state.tutorial);

  if (!stepSellected) return null;

  return (
    <div className="d-flex align-items-center justify-content-center position-fixed w-100 pagination-tutorial gap-2 fade-in">
      {pagination.map((s) => {
        return (
          <div
            className={`item d-flex align-items-center ${
              s === stepSellected.id ? "--sellected" : ""
            }`}
            key={s}
          >
            {stepSellected.id === s ? s : ""}
          </div>
        );
      })}
    </div>
  );
};

export default PaginationTutorial;
