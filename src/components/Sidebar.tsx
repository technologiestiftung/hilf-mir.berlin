import { FC } from "react";

export const Sidebar: FC<{ isOpen: boolean }> = ({ isOpen, children }) => {
  return (
    <div
      className={`absolute top-20 left-4 p-4 bg-white w-80 md:w-96 shadow-md z-20 overflow-y-auto transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-96 !-left-4"
      }`}
      style={{ height: "calc(100% - 64px - 32px)" }}
    >
      {children}
    </div>
  );
};
