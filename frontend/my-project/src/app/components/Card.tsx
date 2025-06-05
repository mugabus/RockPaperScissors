import React from "react";
import classNames from "classnames";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={classNames("bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl", className)}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={classNames("flex flex-col gap-4", className)}>{children}</div>;
}
