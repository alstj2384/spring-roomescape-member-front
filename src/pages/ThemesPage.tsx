import { useEffect, useState } from 'react'
import { Grid3X3 } from 'lucide-react'
import { api } from '../api'
import ThemeCard from '../components/ThemeCard'
import type { Theme } from '../types'

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.themes.list()
      .then(setThemes)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Grid3X3 className="text-escape-red" size={24} />
        <h1 className="section-title mb-0">전체 테마</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="escape-card h-64 animate-pulse" />
          ))}
        </div>
      ) : themes.length === 0 ? (
        <p className="text-gray-500 text-center py-20">등록된 테마가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      )}
    </div>
  )
}
