import React from "react";

const Empty = ({ message = "Hmmm 🧐🧐🧐... It's empty!" }: { message?: string }) => {
  return (
    <section className="empty-component d-flex justify-content-center align-items-center">
      <p style={{ textAlign: "center" }}>{message}</p>
    </section>
  );
};

export default Empty;
