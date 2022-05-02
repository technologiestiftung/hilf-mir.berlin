import { FC } from "react";

export const Sidebar: FC<{ isOpen: boolean }> = ({ isOpen, children }) => {
  return (
    <div
      className={`absolute top-[72px] left-4 px-4 py-6 bg-white w-96 z-10 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-96 !-left-4"
      }`}
      style={{ height: "calc(100% - 57px - 32px)" }}
    >
      {children}
    </div>
  );
};
