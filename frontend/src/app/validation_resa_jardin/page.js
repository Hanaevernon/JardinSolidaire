"use client";
import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GardenInfoCard from "../../components/validation_reservation_jardins/GardenInfoCard";

export default function ValidationReservationJardinsPage() {
  const params = useSearchParams();
  const router = useRouter();

  // Récup des infos query (?startDate&startTime&endDate&endTime)
  const { startDate, startTime, endDate, endTime } = useMemo(
    () => ({
      startDate: params.get("startDate") || "",
      startTime: params.get("startTime") || "",
      endDate: params.get("endDate") || "",
      endTime: params.get("endTime") || "",
    }),
    [params]
  );

  const dateLine =
    startDate && startTime
      ? `${startDate} à ${startTime}${endTime ? ` – ${endTime}` : ""}`
      : "Non spécifiée";

  // Actions
  const handleAccept = () => {
    // TODO : appel API PATCH /reservation/:id (statut=acceptée)
    alert("✅ Réservation acceptée !");
    router.push("/profil");
  };

  const handleReject = () => {
    // TODO : appel API PATCH /reservation/:id (statut=refusée)
    alert("❌ Réservation refusée.");
    router.push("/profil");
  };

  return (
    <main className="flex-1 px-[10%] pt-24 pb-16 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Message + boutons (gauche) */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-white p-6 text-gray-800 space-y-4">
            <p className="text-lg font-semibold">Nouvelle demande de réservation</p>
            <p>
              Vous avez reçu une demande de réservation pour ce jardin à la date :
              <br />
              <span className="font-medium text-green-800">{dateLine}</span>
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAccept}
                className="rounded-full bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 transition"
              >
                Accepter
              </button>
              <button
                onClick={handleReject}
                className="rounded-full bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 transition"
              >
                Refuser
              </button>
            </div>
          </div>
        </div>

        {/* Infos jardin (droite) */}
        <div>
          <GardenInfoCard />
        </div>
      </div>
    </main>
  );
}
