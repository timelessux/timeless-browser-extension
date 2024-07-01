import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { numberFormatter } from "../../../../../../utils/textConvert";
import { useSocialViewModel } from "../../SocialViewModel";
import { EStatusReact } from "../../../../../../ts";
import { usePageLoading } from "../../../../context/LoadingContext";

type Props = {
  likeCount: number;
  isReactedByMe: boolean;
  postId?: string;
  disabled: boolean;
};

const LikeReaction = ({ likeCount, isReactedByMe, postId, disabled }: Props) => {
  const { addReaction, removeReaction, reacting } = useSocialViewModel();
  const [liked, setLiked] = useState<boolean>(isReactedByMe);
  const [likeCountReact, setLikeCountReact] = useState<number>(likeCount);
  const { openMessage, destroyMessage } = usePageLoading();

  const handleReact = async () => {
    if (disabled) return;
    if (!postId) return;
    if (reacting) return;

    setLiked(!liked);
    if (liked) {
      setLikeCountReact(likeCountReact - 1);
      const res = await removeReaction(postId);
      if (res === EStatusReact.DONE) {
        setLiked(false);
        destroyMessage();
        openMessage("success", "Success");
        return;
      } else {
        setLiked(true);
        setLikeCountReact(likeCountReact + 1);
        destroyMessage();
        openMessage("error", "Error");
        return;
      }
    } else {
      setLikeCountReact(likeCountReact + 1);
      const res = await addReaction(postId);
      if (res === EStatusReact.DONE) {
        setLiked(true);
        destroyMessage();
        openMessage("success", "Success");
        return;
      } else {
        setLiked(false);
        destroyMessage();
        setLikeCountReact(likeCountReact - 1);
        openMessage("error", "Error");
        return;
      }
    }
  };

  useEffect(() => {
    if (reacting) {
      openMessage("loading", "Loading...");
    }
  }, [reacting]);

  return (
    <div
      className="like-reaction cursor-pointer"
      onClick={(e) => {
        handleReact(), e.stopPropagation();
      }}
    >
      <span>
        {liked ? <AiFillHeart color="#F4245E" size={18} /> : <AiOutlineHeart size={18} />}
      </span>
      <span className="counter align-middle ms-2" style={{ color: "#fff" }}>
        {numberFormatter(likeCountReact, 1)}
      </span>
    </div>
  );
};

export default LikeReaction;
