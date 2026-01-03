
"use client";
import { Suspense } from "react";

export default function AnnulationReservationJardinsPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AnnulationReservationJardinsPageContent />
    </Suspense>
  );
}

function AnnulationReservationJardinsPageContent() {
  const params = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Récup infos réservation
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

  // Annulation
  const handleCancel = async () => {
    try {
      setLoading(true);
      setMessage("");

      // ⚠️ À adapter selon ton backend (id réservation en param)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reservation/annuler`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ startDate, startTime, endDate, endTime }),
        }
      );

      if (response.ok) {
        setMessage("✅ Réservation annulée avec succès.");
        setTimeout(() => router.push("/profil"), 2000);
      } else {
        const err = await response.json();
        setMessage(err.error || "❌ Erreur lors de l’annulation.");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 px-[10%] pt-24 pb-16">
      <div className="max-w-xl mx-auto rounded-2xl border bg-white p-6 text-gray-800 space-y-6 shadow">
        <h1 className="text-xl font-bold text-red-600">
          Annulation de la réservation
        </h1>

        <p>
          Vous êtes sur le point d’annuler la réservation prévue le{" "}
          <span className="font-medium text-green-800">{dateLine}</span>.
        </p>

        {message && (
          <p
            className={`${
              message.startsWith("✅")
                ? "text-green-700"
                : "text-red-600"
            } font-medium`}
          >
            {message}
          </p>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="rounded-full bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 transition disabled:opacity-50"
          >
            {loading ? "Annulation..." : "Confirmer l’annulation"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/profil")}
            className="rounded-full border border-gray-300 px-5 py-2 font-medium"
          >
            Retour
          </button>
        </div>
      </div>
    </main>
  );
}
