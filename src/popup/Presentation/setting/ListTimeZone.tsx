import React, { useEffect, useRef, useState } from "react";
import { useSettingProvider } from "../../context/SettingContext";
import { BsCheck } from "react-icons/bs";
import moment from "moment";
import Invalid from "../token/components/Invalid";
import { IoIosCloseCircle } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};

const ListTimeZone = ({ setOpen, open }: Props) => {
  const { timezone, setTimezone } = useSettingProvider();
  const [currentListTimeZone, setCurrentListTimeZone] = useState<string[]>([]);
  const [listTimeZone, setListTimeZone] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentListTimeZone(moment.tz.names());
    setListTimeZone(moment.tz.names());
  }, []);

  useEffect(() => {
    if (input === "") {
      setListTimeZone(currentListTimeZone);
    } else {
      const searctText = input.toLocaleLowerCase();
      setListTimeZone(
        currentListTimeZone.filter((item) =>
          item.toLocaleLowerCase().includes(searctText.toLocaleLowerCase())
        )
      );
    }
  }, [input, currentListTimeZone]);

  return (
    <div
      className={`time-zone-setting d-flex flex-column px-2 ${open ? "fade-in" : "d-none"}`}
      style={{ overflow: "hidden", flex: 1 }}
    >
      <div className="search-box-token box-grey hover px-3 py-2 d-flex align-items-center gap-1 position-relative w-100 my-2">
        <input
          className="search-time-zone w-100"
          placeholder="Search time zone"
          value={input}
          onChange={(event) => {
            let tempValue = event.target.value.replace(/\s/g, "");
            setInput(tempValue);
          }}
          ref={searchRef}
        />
        {input && (
          <IoIosCloseCircle
            size={20}
            onClick={() => {
              setInput("");
              if (searchRef.current && searchRef.current.value) {
                searchRef.current.value = "";
              }
            }}
            className="cursor-pointer me-2 delete-search"
          />
        )}
        <AiOutlineSearch size={20} />
      </div>
      <div className="hidden-scroll-bar" style={{ flex: 1, overflow: "scroll" }}>
        <div className="list-time-zone w-100 h-100">
          {listTimeZone.length > 0 ? (
            listTimeZone.map((tz) => (
              <button
                className={`d-flex align-items-center justify-content-between gap-2 time-zone-button hover w-100 py-2 ${
                  tz === timezone && "--active"
                }`}
                style={{
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#fff",
                }}
                key={tz}
                onClick={() => {
                  setTimezone(tz);
                  setOpen(false);
                }}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <span className="chain-name align-middle">{tz}</span>
                  {tz === timezone && (
                    <div className="d-flex align-items-center">
                      <BsCheck color="greenyellow" size={18} />
                    </div>
                  )}
                </div>
              </button>
            ))
          ) : (
            <Invalid message="Not found!" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListTimeZone;
