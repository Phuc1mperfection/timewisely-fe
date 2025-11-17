import React, { useState } from "react";
import {
  PaginatedList as PaginationUI,
  PaginatedListContent,
  PaginatedListEllipsis,
  PaginatedListItem,
  PaginatedListLink,
  PaginatedListNext,
  PaginatedListPrevious,
} from "@/components/ui/pagination";

interface PaginatedListProps<T> {
  items: T[];
  itemsPerPage?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  gridClassName?: string; // Custom grid layout
}

export function PaginatedList<T extends { id: string }>({
  items,
  itemsPerPage = 5,
  renderItem,
  emptyMessage = "No items to display",
  className = "",
  gridClassName = "grid gap-4", // Default grid layout
}: PaginatedListProps<T>): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  // Helper to generate page numbers with ellipsis
  const generatePageNumbers = (currentPage: number, totalPages: number) => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        // Near the start: 1 2 3 4 5 ... 10
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near the end: 1 ... 6 7 8 9 10
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // In the middle: 1 ... 4 5 6 ... 10
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Reset to page 1 when items change significantly
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [items.length, currentPage, totalPages]);

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={gridClassName}>
        {paginatedItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {renderItem(item, index)}
          </React.Fragment>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <PaginationUI>
            <PaginatedListContent>
              <PaginatedListItem>
                <PaginatedListPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginatedListItem>

              {generatePageNumbers(currentPage, totalPages).map((page, idx) => (
                <PaginatedListItem key={idx}>
                  {page === "ellipsis" ? (
                    <PaginatedListEllipsis />
                  ) : (
                    <PaginatedListLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginatedListLink>
                  )}
                </PaginatedListItem>
              ))}

              <PaginatedListItem>
                <PaginatedListNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginatedListItem>
            </PaginatedListContent>
          </PaginationUI>
        </div>
      )}
    </div>
  );
}
