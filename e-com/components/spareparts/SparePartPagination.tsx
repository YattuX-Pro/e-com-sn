"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface SparePartPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function SparePartPagination({ currentPage, totalPages, onPageChange }: SparePartPaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(page => {
    if (totalPages <= 5) return true
    if (page === 1 || page === totalPages) return true
    if (Math.abs(page - currentPage) <= 1) return true
    return false
  })

  return (
    <div className="flex items-center justify-center gap-2 mt-8 sm:mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-1">
        {visiblePages.map((page, idx) => {
          const prevPage = visiblePages[idx - 1]
          const showEllipsis = prevPage && page - prevPage > 1

          return (
            <div key={page} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-2 text-slate-400">...</span>
              )}
              <button
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {page}
              </button>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
