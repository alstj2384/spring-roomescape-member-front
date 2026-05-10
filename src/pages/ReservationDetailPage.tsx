import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CalendarCheck, ArrowLeft, KeyRound, CalendarDays, Clock, User } from 'lucide-react'
import { api } from '../api'
import type { Reservation } from '../types'

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.reservations.get(Number(id))
      .then(setReservation)
      .catch(() => navigate('/reservations'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-pulse_red w-12 h-12 rounded-full border-2 border-escape-red" />
      </div>
    )
  }

  if (!reservation) return null

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => navigate('/reservations')}
        className="flex items-center gap-2 text-gray-400 hover:text-escape-gold mb-8 transition-colors duration-200"
      >
        <ArrowLeft size={18} /> 예약 내역으로
      </button>

      <div className="escape-card overflow-hidden">
        {reservation.theme.thumbnailUrl ? (
          <img
            src={reservation.theme.thumbnailUrl}
            alt={reservation.theme.name}
            className="w-full h-56 object-cover opacity-80"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-56 flex items-center justify-center bg-escape-bg">
            <KeyRound size={64} className="text-escape-red opacity-30" />
          </div>
        )}

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <CalendarCheck className="text-escape-red" size={20} />
            <h1 className="font-cinzel font-black text-xl text-white tracking-widest">
              예약 확인
            </h1>
          </div>

          <div className="border-t border-escape-border pt-4 space-y-4">
            <div>
              <p className="text-gray-500 text-xs tracking-widest uppercase mb-1">테마</p>
              <p className="text-white font-semibold text-lg">{reservation.theme.name}</p>
            </div>

            <div className="flex gap-6">
              <div>
                <p className="flex items-center gap-1 text-gray-500 text-xs tracking-widest uppercase mb-1">
                  <CalendarDays size={12} /> 날짜
                </p>
                <p className="text-white">{reservation.date}</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-gray-500 text-xs tracking-widest uppercase mb-1">
                  <Clock size={12} /> 시간
                </p>
                <p className="text-white">{reservation.time.startAt.slice(0, 5)}</p>
              </div>
            </div>

            <div>
              <p className="flex items-center gap-1 text-gray-500 text-xs tracking-widest uppercase mb-1">
                <User size={12} /> 예약자
              </p>
              <p className="text-white">{reservation.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
