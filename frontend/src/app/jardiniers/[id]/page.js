"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Réutiliser la même fonction utilitaire
function getPhotoUrl(photo) {
  if (!photo) return "/assets/default.jpg";

  let p;

  // Cas tableau
  if (Array.isArray(photo)) {
    p = photo[0];
  }
  // Cas JSON string
  else if (typeof photo === "string" && photo.startsWith("[")) {
    try {
      const arr = JSON.parse(photo);
      p = arr[0];
    } catch {
      return "/assets/default.jpg";
    }
  }
  // Cas simple string
  else if (typeof photo === "string") {
    p = photo;
  }

  if (!p) return "/assets/default.jpg";

  // ✅ Supprimer un éventuel "assets/" en début de chaîne
  p = p.replace(/^assets\//, "");

  // ✅ Retourner une URL correcte
  return `/assets/${p}`;
}


export default function JardinierDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [jardinier, setJardinier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservationDate, setReservationDate] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/jardiniers/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setJardinier(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Erreur récupération jardinier :", err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleReservation = () => {
    if (!reservationDate) {
      alert("⚠️ Veuillez sélectionner une date avant de réserver.");
      return;
    }
    router.push(
      `/reservation_jardiniers?id=${id}&date=${reservationDate.toISOString()}`
    );
  };

  if (loading) return <p className="text-center mt-20">⏳ Chargement...</p>;
  if (!jardinier) return <p className="text-center mt-20 text-red-600">❌ Jardinier introuvable.</p>;

  return (
    <div className="min-h-screen px-[10%] py-16 bg-white">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={getPhotoUrl(jardinier.photos)}
          alt={jardinier.titre}
          className="w-32 h-32 rounded-full object-cover border-2 border-pink-600"
        />
        <div>
          <h1 className="text-2xl font-bold text-green-800">{jardinier.titre}</h1>
          <p className="text-sm text-gray-600">{jardinier.description}</p>
          <p className="text-sm text-gray-600">📍 {jardinier.localisation}</p>
          <p className="text-sm text-gray-600">🕒 {jardinier.disponibilites}</p>
          <p className="text-sm text-pink-700">🌱 {jardinier.competences}</p>
        </div>
      </div>

      {/* 📅 Sélection de la date */}
      <div className="my-6">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          Choisissez une date :
        </h2>
        <DatePicker
          selected={reservationDate}
          onChange={(date) => setReservationDate(date)}
          inline
          minDate={new Date()}
        />
      </div>

      <button
        onClick={handleReservation}
        className="mt-4 bg-[#e3107d] hover:bg-pink-800 text-white px-6 py-3 rounded-full font-semibold transition"
      >
        Réserver ce jardinier
      </button>
    </div>
  );
}
