import { useEffect, useState } from 'react'
import { BookOpen, Trash2 } from 'lucide-react'
import { api } from '../api'
import type { Reservation } from '../types'

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.reservations.list()
      .then(setReservations)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Issue 7: optimistic update — UI에서 먼저 제거 후 API 호출, 실패 시 복원
  const handleDelete = async (id: number) => {
    if (!confirm('예약을 취소하시겠습니까?')) return
    const prev = reservations
    setReservations((list) => list.filter((r) => r.id !== id))
    try {
      await api.reservations.delete(id)
    } catch (err) {
      setReservations(prev)
      alert(err instanceof Error ? err.message : '취소에 실패했습니다.')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="text-escape-red" size={24} />
        <h1 className="section-title mb-0">전체 예약 목록</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="escape-card h-16 animate-pulse" />
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p>예약 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="escape-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-escape-border text-gray-400 text-xs tracking-widest uppercase">
                <th className="text-left px-6 py-4">예약자</th>
                <th className="text-left px-6 py-4">테마</th>
                <th className="text-left px-6 py-4">날짜</th>
                <th className="text-left px-6 py-4">시간</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-escape-border/50 hover:bg-escape-bg/40 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-white font-semibold">{r.name}</td>
                  <td className="px-6 py-4 text-escape-gold">{r.theme?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-300">{r.date}</td>
                  <td className="px-6 py-4 text-gray-300">{r.time.startAt.slice(0, 5)}</td>  {/* Issue 5 */}
                  <td className="px-6 py-4 text-right">
                    <button
                      className="btn-danger p-2"
                      onClick={() => handleDelete(r.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
