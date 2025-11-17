import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function PaginatedList({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="PaginatedList"
      data-slot="PaginatedList"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginatedListContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="PaginatedList-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginatedListItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="PaginatedList-item" {...props} />;
}

type PaginatedListLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginatedListLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginatedListLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="PaginatedList-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginatedListPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginatedListLink>) {
  return (
    <PaginatedListLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginatedListLink>
  );
}

function PaginatedListNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginatedListLink>) {
  return (
    <PaginatedListLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginatedListLink>
  );
}

function PaginatedListEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="PaginatedList-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  PaginatedList,
  PaginatedListContent,
  PaginatedListLink,
  PaginatedListItem,
  PaginatedListPrevious,
  PaginatedListNext,
  PaginatedListEllipsis,
};
