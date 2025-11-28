import React from "react";
import { cn } from "@/lib/utils";

const BackgroundWrapper = React.memo(
  ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-background",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

BackgroundWrapper.displayName = "BackgroundWrapper";

export default BackgroundWrapper;
