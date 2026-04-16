"use client";
import { useState, useMemo } from "react";

export function usePagination(items = [], pageSize = 10) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(items.length / pageSize);

  const pageItems = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return {
    page,
    pageItems,
    totalPages,
    hasNext: page < totalPages - 1,
    hasPrev: page > 0,
    next: () => setPage(p => Math.min(p + 1, totalPages - 1)),
    prev: () => setPage(p => Math.max(p - 1, 0)),
    goTo: setPage,
    reset: () => setPage(0),
  };
}