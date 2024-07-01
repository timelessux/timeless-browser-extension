import React from "react";
import { useState } from "react";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import ReactPlayer from "react-player";

type Props = {
  url: string;
  image: string;
  name: string;
  type: string;
};

function AudioMeta({ url, image, name }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div
      className="d-flex my-2 my-md-4 flex-column"
      style={{ borderRadius: 16, backgroundColor: "#464544c2", overflow: "hidden" }}
    >
      <div className="img-audio">
        <img src={image} alt="" width={"100%"} height={"100%"} />
      </div>
      <div className="" style={{ padding: 24 }}>
        <div className="d-flex align-items-center mb-3">
          <div className="me-2 pointer">
            {isPlaying ? (
              <div
                onClick={(e) => {
                  setIsPlaying(false);
                  e.stopPropagation();
                }}
              >
                <AiFillPauseCircle size={48} />
              </div>
            ) : (
              <div
                onClick={(e) => {
                  setIsPlaying(true);
                  e.stopPropagation();
                }}
              >
                <AiFillPlayCircle size={48} />
              </div>
            )}
          </div>
          <div>
            <h4 className="fw-bold truncate-2 tl-audio-name">{name}</h4>
          </div>
        </div>
        <ReactPlayer
          url={url}
          width={"100%"}
          controls
          playing={isPlaying}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          height={52}
          playsinline
          config={{
            file: {
              forceAudio: true,
              attributes: {
                controlsList: "nodownload",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default AudioMeta;
