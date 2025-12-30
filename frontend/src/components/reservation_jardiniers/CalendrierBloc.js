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
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Exemple de créneaux horaires pour une journée
  const slots = [
    { id: 1, label: '08h00 - 09h00' },
    { id: 2, label: '09h00 - 10h00' },
    { id: 3, label: '10h00 - 11h00' },
    { id: 4, label: '11h00 - 12h00' },
    { id: 5, label: '14h00 - 15h00' },
    { id: 6, label: '15h00 - 16h00' },
    { id: 7, label: '16h00 - 17h00' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsConnected(!!token);
  }, []);

  // Sélection de la date sur le calendrier
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setSelectedSlots([]); // reset slots quand on change de date
  };

  // Sélection/déselection d'un créneau
  const handleSlotChange = (slotId) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleReservation = () => {
    if (!isConnected) return;
    alert(
      `Réservation confirmée pour la date ${selectedDate ? selectedDate.toLocaleDateString('fr-FR') : ''} et les créneaux : ` +
      slots.filter((s) => selectedSlots.includes(s.id)).map((s) => s.label).join(', ')
    );
    // Ici, tu peux envoyer la réservation au backend
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded shadow-md">
      <h2 className="text-xl font-bold text-green-700 mb-4">Choisis une date et tes créneaux horaires</h2>

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
        style={{ height: 400 }}
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
        selectable
        onSelectSlot={handleSelectSlot}
      />

      {selectedDate && (
        <div className="mt-6">
          <div className="text-green-800 font-medium mb-3">
            Date sélectionnée : {selectedDate.toLocaleDateString('fr-FR')}
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Créneaux horaires :</div>
            <div className="grid grid-cols-2 gap-2">
              {slots.map((slot) => (
                <label key={slot.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedSlots.includes(slot.id)}
                    onChange={() => handleSlotChange(slot.id)}
                  />
                  <span>{slot.label}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={handleReservation}
            className={`w-full px-6 py-2 rounded-full text-white font-semibold transition duration-200 ${
              isConnected
                ? 'bg-[#e3107d] hover:bg-pink-800'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Réserver les créneaux sélectionnés
          </button>
          {!isConnected && (
            <p className="text-sm text-gray-600 italic mt-2 text-center">
              Connecte-toi pour réserver un créneau 🌿
            </p>
          )}
        </div>
      )}
    </div>
  );
}
