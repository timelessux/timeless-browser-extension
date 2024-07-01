import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "antd";
import { useGetTokenJson } from "../../../hook/useGetTokenJson";
import { TToken } from "../../../../../../ts/types";
import { useOs } from "../../../hook/useOs";
import { EOs } from "../../../../../../ts";
import useHotsKey from "../../../hook/useHotsKey";
const linkIcon = "https://res.cloudinary.com/timeless/image/upload/v1/app/Wallet/Tokens";

const SearchBox = () => {
  const { getTokenByName } = useGetTokenJson({});
  const [searchInput, setSearchInput] = useState<string>("");
  const [dataToken, setDataToken] = useState<TToken[]>([]);
  const { os } = useOs();
  const inputRef = useRef<HTMLInputElement>(null);

  useHotsKey({
    action: () => {
      inputRef.current?.focus();
    },
  });

  useEffect(() => {
    setDataToken(getTokenByName({ name: searchInput }));
  }, [searchInput]);

  return (
    <div className="position-relative">
      <div className="search-box hover px-3 py-1 d-flex align-items-center gap-1 position-relative">
        <input
          type="text"
          placeholder={`Search (${os === EOs.MACOS ? "⌘" : "Ctrl"}K)`}
          onChange={(e) => setSearchInput(e.target.value)}
          ref={inputRef}
        />
      </div>
      {searchInput && (
        <div className="search-result position-absolute top-100 w-100">
          {dataToken.map((itemToken) => (
            <div className="item-option p-3 d-flex gap-3 align-items-center mb-1">
              <Avatar size={24} src={`${linkIcon}/${itemToken?.coin_symbol}`} />
              <span className="align-middle">{itemToken.name || ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SearchBox;
