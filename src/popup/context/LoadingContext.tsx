/* eslint-disable no-unused-vars */
import { message } from "antd";
import React, { ReactNode, createContext, useContext } from "react";
import { NoticeType } from "antd/es/message/interface";

interface PageLoadingContextType {
  openMessage: (type: NoticeType, content: string | ReactNode, icon?: ReactNode) => void;
  destroyMessage: () => void;
}
const config = {
  className: "custom-toast",
};

const PageLoadingContext = createContext<PageLoadingContextType>(null!);

export function PageLoadingProvider({ children }: { children: React.ReactNode }) {
  const [messageApi, contextHolder] = message.useMessage();
  function handleOpenMessage(type: NoticeType, content: string | ReactNode, icon?: ReactNode) {
    messageApi.destroy()
    if (type === "loading") {
      messageApi.open({ type, content, duration: 20 * 1000, ...config });
    } else {
      messageApi.open({ icon, type, content, ...config });
    }
  }

  const value = {
    openMessage: (type: NoticeType, content: string | ReactNode, icon?: ReactNode) =>
      handleOpenMessage(type, content, icon),
    destroyMessage: () => messageApi.destroy(),
  };

  return (
    <PageLoadingContext.Provider value={value}>
      {contextHolder}
      {children}
    </PageLoadingContext.Provider>
  );
}

export function usePageLoading() {
  return useContext(PageLoadingContext);
}
