'use client'
import { useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import GardenerInfoCard from '../../components/validation_reservation_jardiniers/GardenerInfoCard'

export default function ValidationReservationJardiniersPage() {
  const params = useSearchParams()
  const router = useRouter()

  // récup des valeurs passées en query (?startDate&startTime&endDate&endTime)
  const { startDate, startTime, endDate, endTime } = useMemo(() => ({
    startDate: params.get('startDate') || '',
    startTime: params.get('startTime') || '',
    endDate:   params.get('endDate')   || '',
    endTime:   params.get('endTime')   || '',
  }), [params])

  const dateLine = (startDate && startTime)
    ? `${startDate} à ${startTime}${endTime ? ` – ${endTime}` : ''}`
    : 'X date à X heure'

  // redirections
  const goCancel  = () => {
    const url = `/annulation_reservation_jardiniers` +
      `?startDate=${encodeURIComponent(startDate)}` +
      `&startTime=${encodeURIComponent(startTime)}` +
      `&endDate=${encodeURIComponent(endDate)}` +
      `&endTime=${encodeURIComponent(endTime)}`
    router.push(url)
  }
  const goMessage = () => router.push('/messages/nouveau')
  const goProfile = () => router.push('/profil')

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-1 px-[10%] pt-24 pb-16 space-y-8">
        {/* Haut : message (gauche) + infos jardinier (droite) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Gauche 2/3 : message de confirmation */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-white p-6 text-gray-800">
              <p className="text-lg font-semibold mb-2">Votre réservation est bien confirmée.</p>
              <p className="leading-relaxed">
                Vous pouvez contacter l’hôte pour toute question. Sinon, retrouvez vos
                réservations sur votre profil dans l’onglet <span className="font-medium">« Mes réservations »</span>.
              </p>
            </div>
          </div>

          {/* Droite 1/3 : infos du jardinier (lecture seule, sans bouton) */}
          <div>
            <GardenerInfoCard />
          </div>
        </div>

        <hr className="border-zinc-200" />

        {/* Date / heure */}
        <section>
          <p className="text-sm font-medium">Date</p>
          <p className="text-sm text-muted-foreground">{dateLine}</p>
        </section>

        {/* Actions (rose comme "Réserver") */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={goCancel}
            className="rounded-full bg-[#e3107d] hover:bg-pink-800 text-white font-medium px-5 py-2 transition"
          >
            Annuler ma réservation
          </button>

          <button
            type="button"
            onClick={goMessage}
            className="rounded-full bg-[#e3107d] hover:bg-pink-800 text-white font-medium px-5 py-2 transition"
          >
            Envoyer un message à l’hôte
          </button>

          <button
            type="button"
            onClick={goProfile}
            className="rounded-full bg-[#e3107d] hover:bg-pink-800 text-white font-medium px-5 py-2 transition"
          >
            Retourner sur mon profil
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
