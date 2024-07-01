import React from "react";

export function ViewMoreIcon() {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <filter
          x="-5.6%"
          y="-6.8%"
          width="111.3%"
          height="116.0%"
          filterUnits="objectBoundingBox"
          id="filter-_291g_s6ks-1"
        >
          <feOffset dx="0" dy="8" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
          <feGaussianBlur
            stdDeviation="16"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          ></feGaussianBlur>
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.319999993 0"
            type="matrix"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          ></feColorMatrix>
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        fillOpacity="0.300000012"
      >
        <g id="Chrome-Extension-|-Swap-|-Rate" transform="translate(-649, -693)" fill="#E0E8FF">
          <g
            id="Account-Modal-Copy"
            transform="translate(333, 121)"
            filter="url(#filter-_291g_s6ks-1)"
          >
            <g id="Transactions" transform="translate(30, 537)">
              <g id="Button" transform="translate(2, 35)">
                <g id="Icon" transform="translate(284, 0)">
                  <path d="M21.28125,11.6542969 C21.28125,6.56542969 17.0888672,2.37304688 12,2.37304688 C6.90234375,2.37304688 2.71875,6.56542969 2.71875,11.6542969 C2.71875,16.7519531 6.91113281,20.9443359 12,20.9443359 C17.0976562,20.9443359 21.28125,16.7519531 21.28125,11.6542969 Z M5.0390625,11.6542969 C5.0390625,7.79589844 8.1328125,4.68457031 12,4.68457031 C15.8583984,4.68457031 18.9697266,7.79589844 18.9697266,11.6542969 C18.9785156,15.5214844 15.8671875,18.6328125 12,18.6328125 C8.14160156,18.6328125 5.0390625,15.5214844 5.0390625,11.6542969 Z M15.5683594,13.1835938 L15.5683594,9.19335938 C15.5683594,8.44628906 15.1376953,8.05957031 14.4169922,8.05957031 L10.4091797,8.05957031 C9.82910156,8.05957031 9.45117188,8.38476562 9.45117188,8.91210938 C9.45117188,9.43945312 9.82910156,9.7734375 10.4091797,9.7734375 L11.6923828,9.7734375 L12.7207031,9.6328125 L11.5341797,10.6787109 L8.73046875,13.4912109 C8.53710938,13.6757812 8.4140625,13.9394531 8.4140625,14.203125 C8.4140625,14.7832031 8.85351562,15.1699219 9.3984375,15.1699219 C9.68847656,15.1699219 9.92578125,15.0732422 10.1542969,14.8623047 L12.9316406,12.0761719 L13.9775391,10.8984375 L13.8544922,11.9882812 L13.8544922,13.1835938 C13.8544922,13.7724609 14.1884766,14.1416016 14.7158203,14.1416016 C15.2431641,14.1416016 15.5683594,13.7548828 15.5683594,13.1835938 Z"></path>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
