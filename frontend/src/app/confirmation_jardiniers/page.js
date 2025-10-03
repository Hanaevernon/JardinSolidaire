'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import ReservationEditor from '../../components/confirmation_reservation_jardiniers/ReservationEditor'
import AuthButtons from '../../components/confirmation_reservation_jardiniers/AuthButtons'
import GardenerInfoCard from '../../components/confirmation_reservation_jardiniers/GardenerInfoCard'

export default function ReservationPage() {
  const [start, setStart] = useState({ date: '', time: '' })
  const [end,   setEnd]   = useState({ date: '', time: '' })
  const [isAuth, setIsAuth] = useState(false)

  const router = useRouter()
  const params = useSearchParams()

  // init depuis les query params (si on vient du calendrier), sinon valeurs par défaut
  useEffect(() => {
    const sd = params.get('startDate')
    const st = params.get('startTime')
    const ed = params.get('endDate')
    const et = params.get('endTime')

    if (sd && st && ed && et) {
      setStart({ date: sd, time: st })
      setEnd({ date: ed, time: et })
    } else {
      const today = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      const d = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`
      const t1 = `${pad(Math.max(8, today.getHours()))}:00`
      const t2 = `${pad(Math.max(9, today.getHours()+1))}:00`
      setStart({ date: d, time: t1 })
      setEnd({ date: d, time: t2 })
    }

    setIsAuth(
      localStorage.getItem('user_auth') === 'true' ||
      !!localStorage.getItem('token')
    )
  }, [params])

  const handleEditorChange = ({ start: s = start, end: e = end }) => {
    setStart(s); setEnd(e)
  }

  const handleReserve = () => {
    if (!isAuth) {
      router.push('/connexion')
      return
    }
    const url = `/validation_reservation_jardiniers` +
      `?startDate=${encodeURIComponent(start.date)}` +
      `&startTime=${encodeURIComponent(start.time)}` +
      `&endDate=${encodeURIComponent(end.date)}` +
      `&endTime=${encodeURIComponent(end.time)}`
    router.push(url)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-1 px-[10%] pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* GAUCHE 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            <ReservationEditor start={start} end={end} onChange={handleEditorChange} />
            {!isAuth && (
              <AuthButtons loginHref="/connexion" registerHref="/inscription" />
            )}
          </div>

          {/* DROITE 1/3 */}
          <div>
            <GardenerInfoCard canReserve={isAuth} onReserve={handleReserve} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
