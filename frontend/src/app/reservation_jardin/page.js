import { Suspense } from "react";
import ReservationPage from "./index";

export default function Reservation() {
  return (
    <main className="min-h-screen pt-20 pb-16">
      <Suspense fallback={<p className="text-center">Chargement...</p>}>
        <ReservationPage />
      </Suspense>
    </main>
  );
}
