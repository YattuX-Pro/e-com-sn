import Link from "next/link"

export default function ProductsHeader() {
  return (
    <div className="pt-20 pb-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-blue-500 transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium">Catalogue</span>
        </div>
      </div>
    </div>
  )
}
