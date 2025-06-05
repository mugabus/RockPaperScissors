import React from "react";
import classNames from "classnames";

export function Button({
  children,
  onClick,
  className,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(
        "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition duration-200",
        className
      )}
    >
      {children}
    </button>
  );
}
