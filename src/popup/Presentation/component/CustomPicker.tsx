import React, { useEffect, useRef, useState } from "react";
import { ArrowDownIcon } from "../../assets/icons/arrowDown";

type CustomPickerProps<T> = {
  initialValue?: T;
  data: T[];
  onChange?: (value: T) => void;
  className?: string;
};

const CustomPicker = <T,>(props: CustomPickerProps<T>) => {
  const { className, data, initialValue, onChange } = props;
  const [currentValue, setCurrentValue] = useState(initialValue);

  useEffect(() => {
    initialValue && setCurrentValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    onChange && currentValue && onChange(currentValue);
  }, [currentValue]);

  return (
    <div className={`select-container position-relative ${className}`}>
      <div
        className={`options-container d-flex gap-2 p-1
      `}
      >
        {data.map((e, i) => {
          return (
            <div
              key={i}
              className={`py-2 px-3 option-item ${currentValue === e ? "--active" : ""}`}
              onClick={() => {
                setCurrentValue(e);
              }}
            >
              <div className="text-center">{`${e} words`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomPicker;
