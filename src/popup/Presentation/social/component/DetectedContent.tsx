import React from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { convertMentionToLink } from "../../../../../utils/textConvert";

const MAX_LENGTH_CONTENT = 250;
const DetectedContent = ({ content }: { content: string }) => {
  const [isSeemore, setIsSeemore] = useState(false);

  return (
    <>
      <ReactMarkdown
        className="markdown-content"
        components={{
          a: ({ children, ...props }) => {
            if (/(^|\s)@\S+[a-z0-9A-Z]/gm.test(children[0] as string)) {
              return <span>{children}</span>;
            }
            if (/(^|\s)#\S+[a-z0-9A-Z]/gm.test(children[0] as string)) {
              //   const link = `/search?query=${children[0]?.toString().replace("#", "")}&type=${
              //     ETabSearch.POST
              //   }`;
              return (
                <span
                  className="tag-added"
                  // {...props}
                >
                  {children}
                </span>
              );
            }
            if (
              /(^|\s)#\S+[a-z0-9A-Z]/g.test(children[0] as string) &&
              children[0]?.toString().includes("#Snapshot")
            ) {
              return <></>;
            }
            if (children[0]?.toString().includes("https://snapshot.org")) {
              return (
                <a
                  href={children[0].toString()}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noreferrer"
                >
                  #Snapshot
                </a>
              );
            }

            return (
              <a target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} {...props}>
                {children}
              </a>
            );
          },
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content &&
          convertMentionToLink(
            isSeemore && content.length > MAX_LENGTH_CONTENT
              ? content
              : content.substring(0, MAX_LENGTH_CONTENT)
          )}
      </ReactMarkdown>
      {content && !isSeemore && content.length > MAX_LENGTH_CONTENT && (
        <span
          className="show-more-button cursor-pointer"
          style={{ fontSize: 14 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsSeemore(true);
          }}
        >
          Show more...
        </span>
      )}
      {content && isSeemore && content.length > MAX_LENGTH_CONTENT && (
        <span
          className="show-more-button cursor-pointer"
          style={{ fontSize: 14 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsSeemore(false);
          }}
        >
          Show less
        </span>
      )}
    </>
  );
};

export default DetectedContent;
