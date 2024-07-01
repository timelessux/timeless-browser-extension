import React, { ReactNode } from "react";
import { EPage } from "../../../../ts";
import Pagination from "./component/pagination";
import PaginationTokenDetail from "../token/CollectionDetail/PaginationCollectionDetail";

type Props = {
  children: ReactNode;
  setMoveY: React.Dispatch<React.SetStateAction<number>>;
  setPage: React.Dispatch<React.SetStateAction<EPage>>;
  page: EPage;
};

const Content = ({ children, setMoveY, setPage, page }: Props) => {
  return (
    <>
      <div className="content w-100 h-100">
        <div className="d-flex flex-column h-100 justify-content-center">
          {children}
          {page === EPage.COLLECTION_DETAIL && <PaginationTokenDetail />}
          {page !== EPage.SOCIAL && page !== EPage.CHAT && (
            <div className="w-100 d-flex justify-content-center py-3 ">
              <Pagination setMoveY={setMoveY} hasToken={true} setPage={setPage} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Content;
