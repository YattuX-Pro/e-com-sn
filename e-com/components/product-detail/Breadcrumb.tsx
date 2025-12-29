import Link from "next/link"

interface BreadcrumbProps {
  productName: string
}

export default function Breadcrumb({ productName }: BreadcrumbProps) {
  return (
    <div className="pt-20 pb-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-slate-500 hover:text-blue-500 transition-colors">Accueil</Link>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <Link href="/produits" className="text-slate-500 hover:text-blue-500 transition-colors">Catalogue</Link>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px]">{productName}</span>
        </nav>
      </div>
    </div>
  )
}
