"use client"

import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 5) {
      // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      // Always show last page
      pages.push(totalPages)
    }
    
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 mt-8 sm:mt-12">
      {/* Mobile: Simple prev/next with page indicator */}
      <div className="flex sm:hidden items-center gap-3 w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-10 flex-1"
        >
          ← Préc.
        </Button>
        
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
          {currentPage} / {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-10 flex-1"
        >
          Suiv. →
        </Button>
      </div>

      {/* Desktop: Full pagination */}
      <div className="hidden sm:flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-10 px-4"
        >
          ← Précédent
        </Button>
        
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => (
            typeof page === 'number' ? (
              <button
                key={idx}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={idx} className="w-8 text-center text-slate-400">
                {page}
              </span>
            )
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-10 px-4"
        >
          Suivant →
        </Button>
      </div>
    </div>
  )
}
