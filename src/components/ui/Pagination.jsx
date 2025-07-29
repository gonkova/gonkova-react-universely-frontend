import React from "react";
import Button from "@/components/ui/Button";

export default function Pagination({ page, totalPages, onPageChange }) {
  const isMobile = window.innerWidth < 640; // Tailwind sm breakpoint

  const getVisiblePages = () => {
    const delta = 2;
    const pages = [];

    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const shouldShowStartEllipsis = visiblePages[0] > 2;
  const shouldShowEndEllipsis =
    visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <div className="flex justify-center items-center gap-2 pt-6 flex-wrap select-none">
      {/* First */}
      {!isMobile && (
        <Button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          variant="secondary"
          size="sm"
        >
          First
        </Button>
      )}

      {/* Previous */}
      <Button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        variant="primary"
        size="sm"
      >
        ←
      </Button>

      {/* Mobile: only current page / total */}
      {isMobile ? (
        <span className="px-3 py-1 font-semibold text-gray-700 dark:text-gray-300">
          {page} / {totalPages}
        </span>
      ) : (
        <>
          {/* 1 + ellipsis */}
          {visiblePages[0] > 1 && (
            <>
              <Button
                onClick={() => onPageChange(1)}
                variant="secondary"
                size="sm"
              >
                1
              </Button>
              {shouldShowStartEllipsis && (
                <span className="px-2 text-gray-500">…</span>
              )}
            </>
          )}

          {/* Visible Pages */}
          {visiblePages.map((p) => (
            <Button
              key={p}
              onClick={() => onPageChange(p)}
              variant={p === page ? "primary" : "secondary"}
              size="sm"
            >
              {p}
            </Button>
          ))}

          {/* ... + totalPages */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {shouldShowEndEllipsis && (
                <span className="px-2 text-gray-500">…</span>
              )}
              <Button
                onClick={() => onPageChange(totalPages)}
                variant="secondary"
                size="sm"
              >
                {totalPages}
              </Button>
            </>
          )}
        </>
      )}

      {/* Next */}
      <Button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        variant="primary"
        size="sm"
      >
        →
      </Button>

      {/* Last */}
      {!isMobile && (
        <Button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          variant="secondary"
          size="sm"
        >
          Last
        </Button>
      )}
    </div>
  );
}
