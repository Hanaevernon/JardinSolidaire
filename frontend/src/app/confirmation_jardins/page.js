"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReservationEditor from "../../components/confirmation_reservation_jardins/ReservationEditor";
import AuthButtons from "../../components/confirmation_reservation_jardins/AuthButtons";
import GardenInfoCard from "../../components/confirmation_reservation_jardins/GardenInfoCard";


export default function ConfirmationReservationJardinsPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ConfirmationReservationJardinsPageContent />
    </Suspense>
  );
}

function ConfirmationReservationJardinsPageContent() {
  const [start, setStart] = useState({ date: "", time: "" });
  const [end, setEnd] = useState({ date: "", time: "" });
  const [isAuth, setIsAuth] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const sd = params.get("startDate");
    const st = params.get("startTime");
    const ed = params.get("endDate");
    const et = params.get("endTime");

    if (sd && st && ed && et) {
      setStart({ date: sd, time: st });
      setEnd({ date: ed, time: et });
    } else {
      const today = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const d = `${today.getFullYear()}-${pad(
        today.getMonth() + 1
      )}-${pad(today.getDate())}`;
      setStart({ date: d, time: "09:00" });
      setEnd({ date: d, time: "10:00" });
    }

    setIsAuth(
      localStorage.getItem("user_auth") === "true" ||
        !!localStorage.getItem("token")
    );
  }, [params]);

  const handleEditorChange = ({ start: s = start, end: e = end }) => {
    setStart(s);
    setEnd(e);
  };

  const handleReserve = () => {
    if (!isAuth) {
      router.push("/connexion");
      return;
    }
    const url =
      `/validation_resa_jardins` +
      `?startDate=${encodeURIComponent(start.date)}` +
      `&startTime=${encodeURIComponent(start.time)}` +
      `&endDate=${encodeURIComponent(end.date)}` +
      `&endTime=${encodeURIComponent(end.time)}`;
    router.push(url);
  };

  return (
    <main className="flex-1 px-[10%] pt-24 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* GAUCHE 2/3 : éditeur + auth */}
        <div className="lg:col-span-2 space-y-6">
          <ReservationEditor
            start={start}
            end={end}
            onChange={handleEditorChange}
          />
          {!isAuth && (
            <AuthButtons loginHref="/connexion" registerHref="/inscription" />
          )}
        </div>

        {/* DROITE 1/3 : infos jardin + bouton réserver */}
        <div>
          <GardenInfoCard canReserve={isAuth} onReserve={handleReserve} />
        </div>
      </div>
    </main>
  );
}
