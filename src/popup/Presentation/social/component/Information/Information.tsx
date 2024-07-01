import React, { useEffect, useState } from "react";
import Avatar from "../../../component/Avatar";
import { getData } from "../../../../../../utils/chromeStorage";
import { reformatToValidLink } from "../../../../../../utils/link";
import avt1 from "../../../../assets/icons/avt1.png";
import { Profile, ProfileAttribute } from "../../../../Domain/Model/Profile";
import { PiSealCheckFill } from "react-icons/pi";
import { MdModeEditOutline } from "react-icons/md";
import { BsCalendar3, BsDot, BsPinMapFill } from "react-icons/bs";
import { BiLink } from "react-icons/bi";
import moment from "moment-timezone";
import { numberFormatter } from "../../../../../../utils/textConvert";
import ListPost from "./components/ListPost";
import Logo from "../../../../assets/images/background.png";
import { ImageMeta } from "../../../component/Image";

type Props = {
  isExpanded: boolean;
};

const Information = ({ isExpanded }: Props) => {
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    getData("lensProfile").then((res) => {
      if (res) {
        setProfile(res);
      }
    });
  }, []);

  // if (!profile) return null;

  return (
    <div
      className={`information-container fade-in hidden-scroll-bar h-100 w-100 ${isExpanded ? "" : "--expanded"
        }`}
      id="information"
    >
      <div className="background w-100 h-100">
        <div className="logo">
          <ImageMeta url={Logo} name={""} />
        </div>
      </div>
      <div style={{ marginTop: "-15px" }}>
        <div className="header-info d-flex align-items-center gap-2 px-3">
          <Avatar
            size={80}
            radius={"50%"}
            border={"solid 2px #ffffff8a"}
            src={profile?.avatar ? reformatToValidLink(profile.avatar) : avt1}
          />
          <div className="info">
            <div className="name-and-handle" style={{ marginTop: 16 }}>
              <div className="name d-flex align-items-center gap-1">
                <span>{profile?.name ?? profile?.handle ?? profile?.id}</span>
                <div
                  style={{ minWidth: 16, minHeight: 16, maxHeight: 16, maxWidth: 16 }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <PiSealCheckFill size={16} />
                </div>
              </div>
              <div className="handle">@{profile?.handle}</div>
            </div>
          </div>
          <div
            className="action d-none cursor-pointer hover d-flex justify-content-center align-items-center"
            style={{ marginTop: 16 }}
          >
            <MdModeEditOutline />
          </div>
        </div>
        {profile?.bio && <div className="bio ms-1 mt-1 mb-3 px-3">{profile?.bio}</div>}
        {profile?.attributes?.map((attribute) => (
          <RenderAttributes attribute={attribute} key={attribute.key} />
        ))}
        <div className="attribute-item d-flex align-items-center mt-1 gap-1 px-3">
          <div
            style={{ minWidth: 16, minHeight: 16, maxHeight: 16, maxWidth: 16 }}
            className="d-flex align-items-center justify-content-center"
          >
            <BsCalendar3 size={16} />
          </div>
          <span>Joined {profile?.createdAt && moment(profile?.createdAt).format("MMM YYYY")}</span>
        </div>

        <div className="follow-status d-flex gap-1 align-items-center mt-3 px-3">
          <div className="following d-flex gap-1 align-items-center">
            <span className="count">
              {numberFormatter(profile?.wallet?.totalFollowings || 0, 1)}
            </span>
            <span className="text">Following</span>
          </div>
          <BsDot color="#ffffff5a" />
          <div className="follower d-flex gap-1 align-items-center">
            <span className="count">
              {profile?.totalFollowers
                ? numberFormatter(profile?.wallet?.totalFollowers || 0, 1)
                : 0}
            </span>
            <span className="text">Followers</span>
          </div>
        </div>

        <div className="group-button mt-4 d-flex gap-2 px-3">
          <button className="--active">Timeline</button>
          <button>Wallet</button>
          <button>Collectible</button>
          <button>Likes</button>
        </div>
        <ListPost />
      </div>
    </div>
  );
};

export default Information;

const RenderAttributes = ({ attribute }: { attribute: ProfileAttribute }) => {
  switch (attribute.key) {
    case "location": {
      return (
        <div className="attribute-item d-flex align-items-center gap-1 px-3">
          <div
            style={{ minWidth: 16, minHeight: 16, maxHeight: 16, maxWidth: 16 }}
            className="d-flex align-items-center justify-content-center"
          >
            <BsPinMapFill size={16} />
          </div>
          <span>{attribute?.value}</span>
        </div>
      );
    }

    case "website": {
      return (
        <div className="attribute-item d-flex align-items-center gap-1 px-3">
          <div
            style={{ minWidth: 16, minHeight: 16, maxHeight: 16, maxWidth: 16 }}
            className="d-flex align-items-center justify-content-center"
          >
            <BiLink size={16} />
          </div>
          <a href={attribute.value} target="_blank" rel="noreferrer">
            {attribute?.value}
          </a>
        </div>
      );
    }

    default:
      return null;
  }
};
