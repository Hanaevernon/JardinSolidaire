"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Fonction utilitaire pour gérer les URLs des photos
function getPhotoUrl(photo) {
  // Si pas de photo, retourner une image par défaut
  if (!photo) return "/assets/default.jpg";

  let photoPath;

  // Cas 1: Photo est un tableau
  if (Array.isArray(photo)) {
    photoPath = photo[0];
  }
  // Cas 2: Photo est une chaîne JSON (ex: '["photo1.jpg", "photo2.jpg"]')
  else if (typeof photo === "string" && photo.startsWith("[")) {
    try {
      const photoArray = JSON.parse(photo);
      photoPath = Array.isArray(photoArray) ? photoArray[0] : photo;
    } catch (error) {
      console.error("Erreur parsing JSON des photos:", error);
      photoPath = photo;
    }
  }
  // Cas 3: Photo est une chaîne simple
  else if (typeof photo === "string") {
    photoPath = photo;
  }
  // Cas 4: Autre type
  else {
    return "/assets/default.jpg";
  }

  // Si pas de chemin valide
  if (!photoPath || photoPath.trim() === "") {
    return "/assets/default.jpg";
  }

  // Si c'est déjà une URL complète (http/https)
  if (photoPath.startsWith("http")) {
    return photoPath;
  }

  // Nettoyer le chemin et construire l'URL
  const cleanPath = photoPath.replace(/^\/+|assets\/+/g, "");
  
  // Retourner l'URL complète vers le dossier public
  return `/assets/${cleanPath}`;
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
          console.log("Données jardinier reçues:", data);
          console.log("Photos jardinier:", data.photos);
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
          onError={(e) => {
            console.log("Erreur chargement image:", e.target.src);
            e.target.src = "/assets/default.jpg";
          }}
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
