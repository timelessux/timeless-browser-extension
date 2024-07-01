import React from "react";

export function SlideIcon({
  color,
  className,
  opacity,
}: {
  color?: string;
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      width="136px"
      height="10px"
      viewBox="0 0 136 10"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className ? className : ""}
    >
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        fillOpacity={opacity || "0.3"}
        style={{
          transition: "all 0.3s ease-in-out",
        }}
      >
        <g id="Default-|-Social-view" transform="translate(-905, -906)" fill={color || "#FFFFFF"}>
          <g id="Group-6" transform="translate(320, 162)">
            <g id="Grabber" transform="translate(547, 742)">
              <path d="M43,2 L169,2 C171.761424,2 174,4.23857625 174,7 C174,9.76142375 171.761424,12 169,12 L43,12 C40.2385763,12 38,9.76142375 38,7 C38,4.23857625 40.2385763,2 43,2 Z"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
