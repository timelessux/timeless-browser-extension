import React, { useEffect, useState } from "react";

type Props = {
  src?: string;
  size: number;
  radius: number | string;
  border?: string;
  className?: string;
  alt?: string;
  isLoading?: boolean;
  background?: string;
  padding?: string;
};

const Avatar = ({
  src,
  size,
  radius = "50%",
  className,
  alt,
  isLoading,
  background = "transparent",
  padding = "0px",
  border,
}: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isLoading && !isLoading) {
      setImageLoaded(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    if (src && src !== "undefined") {
      img.src = src;
    } else {
      setImageLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={`avatar ${className ? className : ""} position-relative d-flex align-items-center`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        overflow: "hidden",
        minWidth: size,
        minHeight: size,
        background: background,
        padding: padding,
        border: border,
      }}
    >
      {(!imageLoaded || isLoading) && (
        <div className="skeleton-loader position-absolute">
          <img />
        </div>
      )}
      {src && src !== "undefined" ? (
        <img
          src={src}
          width={"100%"}
          height={"100%"}
          style={{
            objectFit: "cover",
          }}
          loading="lazy"
          alt={alt}
        />
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ background: "grey", minWidth: size, minHeight: size, fontSize: 16 }}
        >
          N
        </div>
      )}
    </div>
  );
};

export default Avatar;
