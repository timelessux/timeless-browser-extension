import React from "react";

export function DotIcon({
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
      width="14px"
      height="14px"
      viewBox="0 0 14 14"
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
        fillOpacity={opacity ? opacity : 1}
        style={{
          transition: "all 0.3s ease-in-out",
        }}
      >
        <g id="Default-|-Social-view" transform="translate(-867, -904)" fill={color || "#FFFFFF"}>
          <g id="Group-6" transform="translate(320, 162)">
            <g id="Grabber" transform="translate(547, 742)">
              <path d="M7,0 C10.8659932,-1.59834986e-15 14,3.13400675 14,7 C14,10.8659932 10.8659932,14 7,14 C3.13400675,14 -4.14730794e-16,10.8659932 0,7 C-1.36162605e-15,3.13400675 3.13400675,-1.78006981e-16 7,0 Z"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
