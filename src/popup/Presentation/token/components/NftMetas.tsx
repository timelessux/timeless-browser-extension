import React, { useCallback, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useInViewport } from "react-in-viewport";
import Invalid from "./Invalid";
import { ImageMeta } from "../../component/Image";
import { NFT } from "../../../Domain/Model/Token";
import { returnImageUrl } from "../../../../../utils/link";
import { Scrubber } from "react-scrubber";
import "react-scrubber/lib/scrubber.css";
import { FaPause, FaPlay } from "react-icons/fa";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";

type Props = {
  cardData: NFT;
  onlyImage: boolean;
};

export const NftMetas = ({ cardData, onlyImage }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const cardNftRef = useRef<HTMLDivElement>(null);
  const { inViewport } = useInViewport(cardNftRef);

  const RenderMeta = useCallback(() => {
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [isMute, setIsMute] = useState<boolean>(false);
    const videoRef = useRef<ReactPlayer>(null);

    // function setVolumn(volumn: number) {
    //   if (volumn >= 0 && volumn < 101) {
    //     setNewVolumn(volumn);
    //   }
    // }

    // function seekTo(value: number, type?: "seconds" | "fraction") {
    //   videoRef.current?.seekTo(value, type);
    // }

    if (error)
      return (
        <div className="mb-2 position-relative img-nft">
          <div className="d-flex w-100 h-100 justify-content-center img-nft-wrapper">
            <Invalid message={error} />
          </div>
        </div>
      );

    if (cardData.videoUrl && !onlyImage) {
      return (
        <div className="nft-meta-video h-100" style={{ borderRadius: 16, overflow: "hidden" }}>
          <ReactPlayer
            url={cardData.videoUrl}
            width="100%"
            height="100%"
            muted
            controls
            loop
            playsinline
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                },
              },
            }}
            onError={() => setError("Invalid video!")}
          />
        </div>
      );
    }

    if (cardData.audioUrl && !onlyImage && cardData.audioProperties) {
      return (
        <div className="nft-meta-video">
          <ReactPlayer
            ref={videoRef}
            url={cardData.audioUrl}
            width="100%"
            height="100%"
            playing={isPlaying}
            controls={false}
            muted={isMute}
            progressInterval={100}
            onProgress={(value) => {
              setCurrentTime(value.playedSeconds);
            }}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                },
              },
            }}
            onError={() => setError("Invalid video!")}
          />
          {cardData.imageUrl ? (
            <ImageMeta url={cardData.imageUrl} name={cardData.name} />
          ) : (
            <Invalid message="No image!" />
          )}
          <div className="mt-4 d-flex align-items-center position-relative">
            <div className="play-pause-icon position-absolute" style={{ left: -40 }}>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setIsPlaying(!isPlaying), console.log(isPlaying);
                }}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </div>
            </div>
            <Scrubber
              min={0}
              max={cardData.audioProperties.duration}
              className="cursor-pointer"
              value={currentTime}
              onScrubChange={(value: number) => {
                setCurrentTime(value);
              }}
              onScrubEnd={(value: number) => {
                setCurrentTime(value);
              }}
            />
            <div className="volumn-icon position-absolute" style={{ right: -40 }}>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setIsMute(!isMute), console.log("isMute", isMute);
                }}
              >
                {isMute ? <FaVolumeXmark /> : <FaVolumeHigh />}
              </div>
            </div>
          </div>
        </div>
      );
    }

    const previewImage = returnImageUrl({
      previews: cardData.previews,
      original: cardData.imageUrl,
    });

    if (previewImage) {
      return <ImageMeta url={previewImage} name={cardData.name} />;
    }

    return <Invalid message="No image!" />;
  }, [cardData, error, inViewport]);

  return (
    <div className="nft-meta h-100" ref={cardNftRef}>
      <RenderMeta />
    </div>
  );
};
