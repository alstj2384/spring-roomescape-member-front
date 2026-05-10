import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { api } from '../api'
import ThemeCard from '../components/ThemeCard'
import type { Theme } from '../types'

const today = new Date().toISOString().split('T')[0]

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.themes.famous({ limit: 10, days: 7, date: today })
      .then(setThemes)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="text-escape-red" size={24} />
        <h1 className="section-title mb-0">인기 테마</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="escape-card h-64 animate-pulse" />
          ))}
        </div>
      ) : themes.length === 0 ? (
        <p className="text-gray-500 text-center py-20">인기 테마 데이터가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, i) => (
            <ThemeCard key={theme.id} theme={theme} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
