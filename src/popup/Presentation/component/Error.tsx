import React from "react";

const Error = ({ message = "Something went wrong 🐛" }: { message?: string }) => {
  return (
    <section className="tl-error-component d-flex justify-content-center align-items-center">
      <p>{message}</p>
    </section>
  );
};

export default Error;
