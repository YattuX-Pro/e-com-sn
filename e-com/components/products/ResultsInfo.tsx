interface ResultsInfoProps {
  count: number
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export default function ResultsInfo({ count, hasActiveFilters, onClearFilters }: ResultsInfoProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        <span className="font-semibold text-slate-900 dark:text-white">{count}</span> produit{count > 1 ? 's' : ''}
      </p>
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Effacer les filtres
        </button>
      )}
    </div>
  )
}
