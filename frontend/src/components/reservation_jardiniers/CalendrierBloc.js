'use client'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import fr from 'date-fns/locale/fr'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEffect, useState } from 'react'

const locales = {
  fr: fr,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const events = [
  {
    title: '10h - 11h',
    start: new Date(2025, 6, 24, 10, 0),
    end: new Date(2025, 6, 24, 11, 0),
  },
  {
    title: '14h - 16h',
    start: new Date(2025, 6, 25, 14, 0),
    end: new Date(2025, 6, 25, 16, 0),
  },
]

export default function CalendrierBloc() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsConnected(!!token)
  }, [])

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded shadow-md">
      <h2 className="text-xl font-bold text-green-700 mb-4">Créneaux disponibles</h2>

      {/* Fix alignement boutons */}
      <style jsx global>{`
        .rbc-toolbar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 0.5rem;
          align-items: center;
        }

        .rbc-event {
          background-color: #e3107d !important;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          padding: 2px 6px;
        }

        .rbc-selected {
          background-color: #e3107d !important;
          opacity: 0.8;
        }
      `}</style>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month', 'week', 'day']}
        messages={{
          next: 'Suivant',
          previous: 'Précédent',
          today: "Aujourd'hui",
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
          agenda: 'Agenda',
        }}
        onSelectEvent={(event) => setSelectedEvent(event)}
      />

      {selectedEvent && (
        <div className="mt-6">
          <div className="text-green-800 font-medium mb-3">
            Créneau sélectionné : {selectedEvent.title}
          </div>

          <button
            onClick={isConnected ? () => alert('Réservation confirmée') : null}
            className={`w-full px-6 py-2 rounded-full text-white font-semibold transition duration-200 ${
              isConnected
                ? 'bg-[#e3107d] hover:bg-pink-800'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Réserver ce créneau
          </button>

          {!isConnected && (
            <p className="text-sm text-gray-600 italic mt-2 text-center">
              Connecte-toi pour réserver un créneau 🌿
            </p>
          )}
        </div>
      )}
    </div>
  )
}
