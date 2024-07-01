import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { ModalBase } from "../ModalBase";
import { EModals, EReferenceModule } from "../../../../../ts";
import { popModal } from "../../../redux/slices/modal/modal.slice";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { BsCheckLg } from "react-icons/bs";
import { setTypePost } from "../../../redux/slices/post/post.slice";

const listAudience = [
  { id: EReferenceModule.PUBLIC, name: "Everyone" },
  { id: EReferenceModule.FOLLOWER_ONLY, name: "Your followers" },
  { id: EReferenceModule.FOLLOWING, name: "People you follow" },
  { id: EReferenceModule.FRENS_OF_FRENS, name: "Frens of frens" },
  { id: EReferenceModule.DISABLED, name: "Disable comments" },
];

export const AudienceModal = () => {
  const dispatch = useAppDispatch();
  const typeSelected = useAppSelector((state) => state.post.type);

  const changeAudience = (type: EReferenceModule) => [dispatch(setTypePost({ type }))];

  return (
    <ModalBase
      modalName={EModals.AUDIENCE_MODAL}
      onCloseModal={() => dispatch(popModal())}
      className="audience-modal"
    >
      <div className="audience-inner position-relative p-3">
        <button className="position-absolute back-button" onClick={() => dispatch(popModal())}>
          <IoArrowBackCircleOutline size={28} />
        </button>
        <div className="title text-center">Who can comment?</div>
        <div className="audience-content mt-4">
          {listAudience.map((audience) => (
            <div
              className={`audience-item py-2 px-3 cursor-pointer d-flex align-items-center justify-content-between ${audience.id === typeSelected ? "--selected" : ""
                }`}
              onClick={() => {
                changeAudience(audience.id);
                dispatch(popModal())
              }}
              key={audience.id}
            >
              <span>{audience.name}</span>
              {typeSelected === audience.id && (
                <span className="fade-in">
                  <span>
                    <BsCheckLg size={20} />
                  </span>
                  <span className="ms-2">Selected</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </ModalBase>
  );
};
