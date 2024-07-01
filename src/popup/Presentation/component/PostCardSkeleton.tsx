import React from "react";
import { Loader } from "./Loader";
import { BsDot } from "react-icons/bs";

const SocialCardColLeftSkeleton = () => {
  return (
    <div className="d-flex flex-column justify-content-between gap-1 row-image skeleton-post-card-col-left">
      <div className="avatar-author-skeleton skeleton-loader" />
      <div className="border-image ms-auto me-auto flex-fill" />
      <div className="group-avatar d-flex">
        <div className="avt skeleton-loader" />
        <div className="avt skeleton-loader" />
      </div>
    </div>
  );
};

const ButtonSkeleton = () => {
  return (
    <div className="skeleton-button d-flex align-items-center justify-content-center">
      <Loader />
    </div>
  );
};

const ActionSkeleton = () => {
  return (
    <div className="action-skeleton d-flex gap-1 align-items-center">
      <div className="action skeleton-loader" />
      <div className="text-loader text skeleton-loader" />
    </div>
  );
};

const ReactionSkeleton = () => {
  return (
    <div className="reaction-skeleton d-flex align-items-center gap-2">
      <div className="text-loader text skeleton-loader" />
      <BsDot color="#ffffff80" />
      <div className="text-loader text skeleton-loader" />
    </div>
  );
};

export const PostCardSkeleton = () => {
  return (
    <div className="card-post-container d-flex skeleton-post-card pt-4 gap-2">
      <SocialCardColLeftSkeleton />
      <div className="flex-fill content-skeleton d-flex flex-column justify-content-between">
        <div>
          <div className="text-loader info-loader skeleton-loader w-100 mt-1" />
          <div className="text-loader skeleton-loader w-100 mt-2" />
          <div className="text-loader skeleton-loader w-100 mt-2" />
          <div className="text-loader skeleton-loader w-100 mt-2" />
          <div className="text-loader skeleton-loader w-100 mt-2" />
          <div className="text-loader skeleton-loader w-100 mt-2" />
          <div className="text-loader skeleton-loader w-100 mt-2" />
        </div>
        <div>
          <div className="d-flex gap-2 mb-3 mt-3">
            <ActionSkeleton />
            <ActionSkeleton />
            <ActionSkeleton />
            <ActionSkeleton />
            <ActionSkeleton />
          </div>
          <div className="mb-2">
            <ReactionSkeleton />
          </div>
        </div>
      </div>
      <ButtonSkeleton />
    </div>
  );
};
