import React from "react";

const AuraLoadingState = ({ show = false }) => {
  if (!show) return null;

  return (
    <>
      <p className="mt-4 text-center">
        Sure! Give me a few moments. Now crafting related products.
      </p>
      <p className={`${"font-medium text-slate-700"} text-center`}>
        Thinking
        <span className={"inline-flex"} aria-hidden="true">
          <span className={"animate-pulse"}>.</span>
          <span className={"animate-pulse"}>.</span>
          <span className={"animate-pulse"}>.</span>
        </span>
      </p>
    </>
  );
};

export default AuraLoadingState;



