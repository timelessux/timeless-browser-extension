import React, { useEffect, useState } from "react";
import { GoCommentDiscussion } from "react-icons/go";
import { getData } from "../../../../../utils/chromeStorage";
import { reformatToValidLink } from "../../../../../utils/link";
import { Profile } from "../../../Domain/Model/Profile";
import avt1 from "../../../assets/icons/avt1.png";
import Avatar from "../../component/Avatar";
import ButtonWithIcon from "../../component/ButtonWithIcon";

interface Props {
  onClick(content: string, title: string): void;
}

export function CommentInput({ onClick }: Props) {
  const [profile, setProfile] = useState<Profile>();
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    getData("lensProfile").then((res) => setProfile(res));
  }, []);

  const handleChangeContent = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerText);
  };

  return (
    <div className="post-inner p-3 border rounded shadow p-3 mb-5">
      <div className="d-flex gap-3">
        <div>
          <Avatar
            size={30}
            src={profile ? reformatToValidLink(profile.avatar) : avt1}
            radius={"50%"}
          />
        </div>
        <div>
          <div className="info">
            {profile?.name && <span className="name">{profile?.name}</span>}
            {profile?.handle && <span className="handle ms-1">@{profile?.handle}</span>}
          </div>
        </div>
      </div>
      <div className="social-input-comment my-2">
        {/* <div id="txtboxMultilineLabel">Enter the tags for the article</div> */}
        <div
          role="textbox"
          contentEditable="true"
          aria-multiline="true"
          aria-labelledby="txtboxMultilineLabel"
          aria-required="true"
          placeholder="What's happening?"
          className="text-area-custom p-2 hover"
          onInput={handleChangeContent}
        ></div>
      </div>
      <div className="d-flex justify-content-end">
        <div
          className={`d-flex align-items-center gap-2 cursor-pointer comment-button px-2 py-1 ${
            content !== "" ? "--success" : "--disabled"
          }`}
          onClick={() => {
            if (content !== "") {
              const title = `Post by @${profile?.handle}`;
              onClick(content, title);
            }
          }}
        >
          <GoCommentDiscussion />
          <span>Comment</span>
        </div>
      </div>
    </div>
  );
}
