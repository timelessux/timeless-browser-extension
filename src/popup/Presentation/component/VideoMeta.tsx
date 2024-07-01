import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useInViewport } from "react-in-viewport";
import { usePlayerContext } from "../../context/PlayerContext";
import React from "react";
type Props = {
  url: string;
  image: string;
};

function VideoMeta({ url, image }: Props) {
  const playerRef = useRef(null);
  const [isPip, setIsPip] = useState(false);
  const { isPlaying, setIsPlaying } = usePlayerContext();

  useInViewport(playerRef, undefined, undefined, {
    // onEnterViewport: () => {
    //   if (typeof isPlaying !== "undefined" && !isPlaying) {
    //     setIsPlaying(true);
    //   }
    // },
    onLeaveViewport: () => {
      if (isPlaying == url) {
        setIsPip(true);
      }
    },
  });
  return (
    <div
      ref={playerRef}
      className="mt-3 tl-video-meta-wrapper position-relative"
      style={{ minHeight: 400, borderRadius: 12, overflow: "hidden" }}
      onClick={(e) => e.stopPropagation()}
    >
      <ReactPlayer
        playing={isPlaying == url}
        url={url}
        width={"100%"}
        muted={isPlaying != url}
        height={450}
        style={{ background: "#000", borderRadius: 12 }}
        onPlay={() => {
          // setIsPlaying(true);
          setIsPlaying(url);
        }}
        onPause={() => {
          if (isPlaying == url) {
            setIsPlaying(null);
          }
        }}
        pip={isPip}
        onDisablePIP={() => {
          setIsPip(false);
        }}
        onEnablePIP={() => {
          setIsPip(true);
        }}
        controls
        loop
        playsinline
        onClickPreview={() => {
          setIsPlaying(url);
        }}
        light={
          image ? (
            <img
              src={image}
              alt={image}
              className="w-100 h-100"
              style={{ maxHeight: 400, objectFit: "cover", borderRadius: 12 }}
            />
          ) : (
            false
          )
        }
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
            },
          },
        }}
      />
    </div>
  );
}

export default VideoMeta;
