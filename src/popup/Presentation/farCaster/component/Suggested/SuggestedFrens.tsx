import React, { useEffect } from "react";
import { PiSealCheckFill } from "react-icons/pi";
import { reformatToValidLink } from "../../../../../../utils/link";
import { Profile } from "../../../../Domain/Model/Profile";
import TimelessAva from "../../../../assets/icons/avt1.png";
import QRCode from "../../../../assets/images/qr-download.png";
import Avatar from "../../../component/Avatar";
import { PostCardSkeleton } from "../../../component/PostCardSkeleton";
import { useSocialViewModel } from "../../SocialViewModel";
import FollowButton from "../FollowButton";

type Props = {
  isExpanded: boolean;
};

const SuggestedFrens = ({ isExpanded }: Props) => {
  const { getLeaderboards, listSuggested } = useSocialViewModel();

  useEffect(() => {
    getLeaderboards();
  }, []);

  return (
    <div
      className={`suggested-frens-container hidden-scroll-bar fade-in h-100 w-100 p-4 ${isExpanded ? "" : "--expanded"
        }`}
    >
      <div className="title-suggested pb-4">Suggested frens</div>
      <div className="content-suggested hidden-scroll-bar py-3">
        {listSuggested.length == 0 ? (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        ) : (
          listSuggested.map((profile) => <SuggestedItem profile={profile} key={profile.id} />)
        )}
      </div>
      <div className="dowload-app d-flex flex-column align-items-center">
        <div className="title-dowload pb-2 pt-4">Download mobile app</div>
        <img src={QRCode} alt="" width={160} height={160} />
      </div>
    </div>
  );
};

export default SuggestedFrens;

const SuggestedItem = ({ profile }: { profile: Profile }) => {
  return (
    <div className="suggested-item pb-3">
      <div className="d-flex gap-1">
        <div className="info d-flex align-items-center gap-2">
          <Avatar
            size={46}
            src={profile ? reformatToValidLink(profile.avatar) : TimelessAva}
            className="hover"
            radius={"50%"}
          />
          <div className="name-and-handle">
            <div className="name d-flex align-items-center gap-1">
              <span className="truncate-1">{profile.name ?? profile.handle ?? profile.id}</span>
              <div style={{ minWidth: 16, minHeight: 16 }}>
                <PiSealCheckFill size={16} />
              </div>
            </div>
            <div className="handle">@{profile.handle}</div>
          </div>
        </div>
        <div className="action">
          <FollowButton disabled={false} profile={profile} />
        </div>
      </div>
    </div>
  );
};
