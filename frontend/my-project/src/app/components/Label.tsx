import React from "react";
import classNames from "classnames";

export function Label({
  children,
  className,
  htmlFor,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={classNames("text-sm font-semibold text-white", className)}
    >
      {children}
    </label>
  );
}
export default Label;
