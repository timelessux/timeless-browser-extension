import React, { useEffect, useState } from "react";
import { Notification as NotificationModel } from "../../Domain/Model/Notification";
import Avatar from "./Avatar";
import { useDashboardModel } from "../dashboard/DashboardViewModel";
import { Profile } from "../../Domain/Model/Profile";
import { reformatToValidLink } from "../../../../utils/link";
import { usePageLoading } from "../../context/LoadingContext";
import { ETypeNoti } from "../../../../ts";
import { ReplyIcon } from "../../assets/icons/replyIcon";
import { LikeIcon } from "../../assets/icons/likeIcon";
import { CollectIcon } from "../../assets/icons/collectIcon";
import { MentionsIcon } from "../../assets/icons/mentionsIcon";
import { MirrorIcon } from "../../assets/icons/mirrorIcon";
import StatusComponent from "./StatusComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import { reformatDateFromNow } from "../../../../utils/date";
import { useAppSelector } from "../../redux/hook";

const renderContentByTypeNoti = ({ type, content }: { type: string; content: string | null }) => {
  return (
    <div className="d-flex align-items-center gap-1 content-noti">
      {type === ETypeNoti.COMMENTS && <ReplyIcon />}
      {type === ETypeNoti.LIKES && <LikeIcon />}
      {type === ETypeNoti.COLLECTS && <CollectIcon />}
      {type === ETypeNoti.MENTIONS && <MentionsIcon />}
      {type === ETypeNoti.MIRRORS && <MirrorIcon />}
      {content}
    </div>
  );
};

const Notification = ({ notification }: { notification: NotificationModel }) => {
  const [profile, setProfile] = useState<Profile>();
  const { getProfile, isLoadingProfile } = useDashboardModel();

  useEffect(() => {
    if (notification.actor_handle)
      getProfile(notification.actor_handle).then((res) => setProfile(res));
  }, []);

  return (
    <div
      className="d-flex align-items-center noti-skeleton box-grey px-2 py-1"
      key={notification.id}
    >
      <Avatar
        size={40}
        src={reformatToValidLink(profile?.avatar)}
        radius={"50%"}
        isLoading={isLoadingProfile}
      />
      <div className="flex-fill ms-2">
        <div className="d-flex align-items-center justify-content-between mb-2 title-item w-100">
          <div>{notification.actor_handle}</div>
          <div className="ms-1 time">{reformatDateFromNow(notification.created_at)}</div>
        </div>
        {renderContentByTypeNoti({
          type: notification.notification_type,
          content: notification.content,
        })}
      </div>
    </div>
  );
};

const SkeletonNotification = () => {
  return (
    <div className="d-flex align-items-center noti-skeleton box-grey p-2">
      <div className="skeleton-loader circle" />
      <div className="ms-2 w-100">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="skeleton-loader text-loader handle" />
          <div className="skeleton-loader text-loader time" />
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="skeleton-loader action" />
          <div className="skeleton-loader text-loader w-100 ms-2" />
        </div>
      </div>
    </div>
  );
};

const loadingComponent = (
  <div>
    <SkeletonNotification />
    <SkeletonNotification />
    <SkeletonNotification />
    <SkeletonNotification />
    <SkeletonNotification />
    <SkeletonNotification />
  </div>
);
interface Props {
  lensId: string;
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListNotification = ({ lensId, setShowNotification }: Props) => {
  const { notifications, getNotification, isLoadingNoti, errorNoti, nextCursorNoti } =
    useDashboardModel();

  const { openMessage, destroyMessage } = usePageLoading();

  const isLock = useAppSelector((state) => state.wallet.isLock);

  useEffect(() => {
    if (isLock) {
      setShowNotification(false);
    }
  }, [isLock]);

  useEffect(() => {
    getNotification({ lensId, cursor: "", isFetchMore: false });
  }, [lensId]);

  useEffect(() => {
    if (errorNoti) {
      destroyMessage();
      openMessage("error", "Error load notification");
      setShowNotification(false);
    }
  }, [errorNoti]);

  return (
    <div
      className="position-absolute px-4 py-3 list-notification background-box fade-in"
      style={{
        right: 80,
        top: 75,
        borderRadius: 10,
      }}
    >
      <div className="mb-2 title">Notification</div>
      <div
        className="d-flex flex-column hidden-scroll-bar"
        style={{
          minWidth: "368.2px",
          minHeight: "40vh",
          maxHeight: "40vh",
          overflow: "scroll",
          borderRadius: 10,
        }}
        id="list-noti"
      >
        <StatusComponent
          loading={isLoadingNoti}
          loadingComponent={loadingComponent}
          empty={!isLoadingNoti && !notifications}
        >
          <InfiniteScroll
            dataLength={notifications?.length ?? 0}
            className="hidden-scroll-bar"
            next={() => {
              getNotification({ lensId, cursor: nextCursorNoti || "", isFetchMore: true });
            }}
            hasMore={(nextCursorNoti ?? null) !== null && !errorNoti}
            loader={
              <div className="mb-4 mt-4">
                <SkeletonNotification />
              </div>
            }
            scrollableTarget="list-noti"
            style={{ overflowX: "hidden" }}
          >
            {notifications?.map((noti) => {
              return (
                <div className="mb-2" key={noti.id}>
                  <Notification notification={noti} />
                </div>
              );
            })}
          </InfiniteScroll>
        </StatusComponent>
      </div>
    </div>
  );
};

export default ListNotification;
