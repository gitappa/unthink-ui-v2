import React from "react";

const AuraSearchPopup = ({ isOpen = false, onClose, children }) => {
  return (
    <div
      className={isOpen ? "fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-md animate-[fadeIn_0.3s_ease]" : ""}
      onClick={() => isOpen && onClose?.()}
    >
      <div
        className={isOpen ? "relative max-h-[90vh] w-[95%] max-w-[1200px] overflow-y-auto rounded-3xl bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-[slideInUp_0.3s_ease]" : ""}
        onClick={(event) => isOpen && event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default AuraSearchPopup;



