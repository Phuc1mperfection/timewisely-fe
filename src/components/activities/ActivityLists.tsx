import React, { useState } from "react";
import { ActivityCard } from "./ActivityCard";
import { motion } from "motion/react";
import type { Activity } from "@/interfaces/Activity";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ActivityListProps {
  activities: Activity[];
  onToggleComplete: (activityId: string) => void;
  itemsPerPage?: number;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  onToggleComplete,
  itemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const incompleteActivities = activities.filter(
    (activity) => !activity.completed
  );
  const completedActivities = activities.filter(
    (activity) => activity.completed
  );

  // Pagination for incomplete activities
  const totalIncompletePages = Math.ceil(
    incompleteActivities.length / itemsPerPage
  );
  const startIncompleteIndex = (currentPage - 1) * itemsPerPage;
  const endIncompleteIndex = startIncompleteIndex + itemsPerPage;
  const paginatedIncomplete = incompleteActivities.slice(
    startIncompleteIndex,
    endIncompleteIndex
  );

  // Pagination for completed activities (separate page state)
  const [completedPage, setCompletedPage] = useState(1);
  const totalCompletedPages = Math.ceil(
    completedActivities.length / itemsPerPage
  );
  const startCompletedIndex = (completedPage - 1) * itemsPerPage;
  const endCompletedIndex = startCompletedIndex + itemsPerPage;
  const paginatedCompleted = completedActivities.slice(
    startCompletedIndex,
    endCompletedIndex
  );

  // Helper to generate page numbers
  const generatePageNumbers = (currentPage: number, totalPages: number) => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // If no activities at all
  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No activities yet</h3>
        <p>Add your activity from the form above to get started.</p>
      </div>
    );
  }

  if (incompleteActivities.length === 0 && completedActivities.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No activities yet</h3>
        <p>Add your activity from the form above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {incompleteActivities.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">
            All activities complete
          </h2>
          <p>Nice work!</p>
        </div>
      ) : (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Active Activities ({incompleteActivities.length})
          </h2>
          <div className="grid gap-4">
            {paginatedIncomplete.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ActivityCard
                  activity={activity}
                  onToggleComplete={onToggleComplete}
                />
              </motion.div>
            ))}
          </div>

          {totalIncompletePages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {generatePageNumbers(currentPage, totalIncompletePages).map(
                    (page, idx) => (
                      <PaginationItem key={idx}>
                        {page === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(totalIncompletePages, p + 1)
                        )
                      }
                      className={
                        currentPage === totalIncompletePages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>
      )}

      {completedActivities.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Completed Activities ({completedActivities.length})
          </h2>
          <div className="grid gap-4">
            {paginatedCompleted.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ActivityCard
                  activity={activity}
                  onToggleComplete={onToggleComplete}
                />
              </motion.div>
            ))}
          </div>

          {totalCompletedPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCompletedPage((p) => Math.max(1, p - 1))
                      }
                      className={
                        completedPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {generatePageNumbers(completedPage, totalCompletedPages).map(
                    (page, idx) => (
                      <PaginationItem key={idx}>
                        {page === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => setCompletedPage(page)}
                            isActive={completedPage === page}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCompletedPage((p) =>
                          Math.min(totalCompletedPages, p + 1)
                        )
                      }
                      className={
                        completedPage === totalCompletedPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>
      )}
    </div>
  );
};