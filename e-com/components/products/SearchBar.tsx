import { Input } from "@/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full lg:flex-1 lg:w-auto relative">
      <svg 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <Input
        type="text"
        placeholder="Rechercher..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 sm:h-11 pl-10 sm:pl-11 pr-4 w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-base"
      />
    </div>
  )
}
