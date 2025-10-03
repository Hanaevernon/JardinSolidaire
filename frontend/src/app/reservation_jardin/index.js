"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReservationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jardinId = searchParams.get("id");
  const dateParam = searchParams.get("date");

  const [jardin, setJardin] = useState(null);
  const [user, setUser] = useState(null);
  const [reservationDate, setReservationDate] = useState(
    dateParam ? new Date(dateParam) : null
  );
  const [editMode, setEditMode] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [commentaire, setCommentaire] = useState("");

  useEffect(() => {
    if (jardinId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/jardins/${jardinId}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => setJardin(data))
        .catch((err) => console.error("❌ Erreur jardin :", err));
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [jardinId]);

  const handleConnexion = () => router.push("/connexion");
  const handleInscription = () => router.push("/inscription");

  const handleReservation = async ({ id_jardin, date_reservation }) => {
    if (!date_reservation) {
      setConfirmationMessage("⚠️ Veuillez sélectionner une date.");
      return;
    }

    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reservations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_utilisateur: Number(currentUser?.id_utilisateur),
            id_jardin: Number(id_jardin),
            date_reservation,
            statut: "en_attente",
            commentaires: commentaire,
          }),
        }
      );

      if (response.ok) {
        setConfirmationMessage("👏 Réservation enregistrée avec succès !");
      } else {
        const err = await response.json();
        console.error("❌ Erreur API :", err);
        setConfirmationMessage("❌ Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      setConfirmationMessage("❌ Erreur réseau. Réessayez plus tard.");
    }
  };

  const handlePreReservation = () => {
    if (!user) {
      // Sauvegarde temporaire si pas connecté
      localStorage.setItem(
        "pending_reservation",
        JSON.stringify({
          id_jardin: jardinId,
          date_reservation: reservationDate,
        })
      );
      router.push("/connexion");
    } else {
      handleReservation({
        id_jardin: jardinId,
        date_reservation: reservationDate?.toISOString(),
      });
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-green-800">
        Demande de réservation
      </h1>

      {/* Date sélectionnée */}
      {!editMode ? (
        <p className="text-lg text-green-700 text-center my-4">
          Date sélectionnée :{" "}
          <strong>{reservationDate?.toLocaleDateString() || "Aucune"}</strong>
          <button
            onClick={() => setEditMode(true)}
            className="ml-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-2 py-1 rounded-full transition"
          >
            Modifier la date
          </button>
        </p>
      ) : (
        <div className="flex flex-col items-center gap-4 my-4">
          <DatePicker
            selected={reservationDate}
            onChange={(date) => setReservationDate(date)}
            inline
            minDate={new Date()}
          />
          <button
            onClick={() => setEditMode(false)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Confirmer la nouvelle date
          </button>
        </div>
      )}

      {/* Infos jardin */}
      {jardin && (
        <div className="mb-6">
          <img
            src={Array.isArray(jardin.photos) ? jardin.photos[0] : jardin.photos}
            alt={jardin.titre}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className="font-bold text-lg mb-2 text-green-800">
            {jardin.titre}
          </p>
          <p className="text-sm text-green-800">{jardin.description}</p>
          <p className="text-sm text-green-800">Adresse : {jardin.adresse}</p>
          <p className="text-sm text-green-800">Type : {jardin.type}</p>
          <p className="text-sm text-green-800">Besoins : {jardin.besoins}</p>
        </div>
      )}

      {/* Commentaire */}
      <div className="mb-4">
        <label className="block text-green-800 mb-1 font-semibold">
          Commentaires :
        </label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Ajoutez un message ou une demande particulière..."
          rows={4}
          className="w-full border border-green-300 rounded-lg p-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Boutons */}
      {!user ? (
        <div className="space-y-4">
          <p className="text-sm mb-2 text-green-800">
            Connectez-vous ou inscrivez-vous pour réserver
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleConnexion}
              className="border px-4 py-2 rounded w-full text-green-800"
            >
              Se connecter
            </button>
            <button
              onClick={handleInscription}
              className="border px-4 py-2 rounded w-full text-green-800"
            >
              S&apos;inscrire
            </button>
          </div>
        </div>
      ) : (
        <button
          className="mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full"
          onClick={handlePreReservation}
        >
          Réserver
        </button>
      )}
      {confirmationMessage && (
        <div className="mt-6 text-center bg-green-100 text-green-800 px-4 py-3 rounded border border-green-300 shadow">
          {confirmationMessage}
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
