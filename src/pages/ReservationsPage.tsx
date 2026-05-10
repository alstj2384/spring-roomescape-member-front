import { useEffect, useState } from 'react'
import { CalendarCheck } from 'lucide-react'
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

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <CalendarCheck className="text-escape-red" size={24} />
        <h1 className="section-title mb-0">예약 내역</h1>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="escape-card h-24 animate-pulse" />
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <CalendarCheck size={48} className="mx-auto mb-4 opacity-30" />
          <p>예약 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="escape-card flex items-center gap-4 p-4">
              <img
                src={reservation.theme.thumbnailUrl}
                alt={reservation.theme.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg truncate">{reservation.theme.name}</p>
                <p className="text-gray-500 text-sm">
                  {reservation.date} · {reservation.time.startAt}
                </p>
                <p className="text-gray-400 text-sm">{reservation.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
