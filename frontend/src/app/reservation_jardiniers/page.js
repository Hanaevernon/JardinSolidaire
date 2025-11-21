"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReservationJardinierPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dateParam = searchParams.get("date");

  const [jardinier, setJardinier] = useState(null);
  const [commentaire, setCommentaire] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  // Créneaux horaires proposés
  const slots = [
    { id: 1, label: '08h00 - 09h00' },
    { id: 2, label: '09h00 - 10h00' },
    { id: 3, label: '10h00 - 11h00' },
    { id: 4, label: '11h00 - 12h00' },
    { id: 5, label: '14h00 - 15h00' },
    { id: 6, label: '15h00 - 16h00' },
    { id: 7, label: '16h00 - 17h00' },
  ];

  // Sélection/déselection d'un créneau
  const handleSlotChange = (slotId) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/jardiniers/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => setJardinier(data))
        .catch((err) => console.error("❌ Erreur récupération jardinier :", err));
    }
  }, [id]);

  const handleReservation = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("⚠️ Vous devez être connecté pour réserver.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_utilisateur: user.id_utilisateur,
          id_jardinier: id,
          date_reservation: dateParam,
          statut: "en_attente",
          commentaires: commentaire,
          creneaux: selectedSlots.map((slotId) => slots.find((s) => s.id === slotId)?.label),
        }),
      });

      if (response.ok) {
        setConfirmationMessage("✅ Réservation confirmée !");
      } else {
        setConfirmationMessage("❌ Une erreur est survenue.");
      }
    } catch (err) {
      console.error("Erreur réservation :", err);
      setConfirmationMessage("❌ Erreur réseau.");
    }
  };

  if (!jardinier) return <p className="text-center mt-20">⏳ Chargement...</p>;

  return (
    <div className="min-h-screen px-[10%] py-16 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        Confirmation de réservation
      </h1>

      <div className="flex items-center gap-6 mb-6">
        <img
          src={
            jardinier.photos && jardinier.photos.length > 0
              ? `/assets/${jardinier.photos[0]}`
              : "/assets/default.jpg"
          }
          alt={jardinier.titre}
          className="w-28 h-28 rounded-full object-cover border-2 border-pink-600"
        />
        <div>
          <h2 className="text-xl font-bold text-green-800">{jardinier.titre}</h2>
          <p className="text-sm text-gray-600">{jardinier.description}</p>
          <p className="text-sm text-gray-600">📍 {jardinier.localisation}</p>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-700">
        📅 Date choisie :{" "}
        <span className="font-medium">
          {new Date(dateParam).toLocaleDateString("fr-FR")}
        </span>
      </p>

      <div className="mb-4">
        <div className="font-semibold mb-2">Sélectionne tes créneaux horaires :</div>
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

      <textarea
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        placeholder="Ajoutez un commentaire ou une demande particulière..."
        className="w-full border border-gray-300 rounded-lg p-3 mb-4"
        rows={4}
      />

      <button
        onClick={handleReservation}
        className="bg-[#e3107d] hover:bg-pink-800 text-white px-6 py-3 rounded-full font-semibold transition"
        disabled={selectedSlots.length === 0}
      >
        Confirmer la réservation
      </button>

      {confirmationMessage && (
        <p className="mt-4 text-center text-green-700 font-semibold">
          {confirmationMessage}
        </p>
      )}
    </div>
  );
}
