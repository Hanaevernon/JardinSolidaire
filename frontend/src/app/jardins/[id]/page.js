"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function JardinPage() {
  const router = useRouter();
  const { id } = useParams();

  const [jardin, setJardin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    async function fetchJardin() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jardins/${id}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setJardin(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchJardin();
  }, [id]);

  const handleReservation = () => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toISOString();
    router.push(`/reservation_jardin?id=${id}&date=${dateStr}`);
  };

  if (loading) return <p className="p-6 text-center">Chargement…</p>;
  if (error) return <p className="p-6 text-center text-red-500">Erreur : {error}</p>;
  if (!jardin) return <p className="p-6 text-center">Jardin introuvable 🌱</p>;

  const photos = Array.isArray(jardin.photos) ? jardin.photos : [];
  const mainPhoto = photos[0] ?? "/assets/default.jpg";
  const thumbnails = photos.slice(1);

  return (
    <div className="min-h-screen p-6 bg-white">
      {/* Titre et propriétaire */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <h1 className="text-2xl font-bold text-green-800">{jardin.titre}</h1>
        <div className="flex gap-3 text-sm text-gray-600">
          <span>
            Propriétaire : {jardin.utilisateur?.nom} {jardin.utilisateur?.prenom}
          </span>
        </div>
      </div>

      {/* Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <img
            src={mainPhoto}
            alt="Photo principale"
            className="rounded-lg w-full h-64 object-cover mb-4"
          />
          {thumbnails.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {thumbnails.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Miniature ${idx + 1}`}
                  className="h-24 w-full object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                />
              ))}
            </div>
          )}
        </div>

        {/* Infos propriétaire */}
        <div className="bg-gray-100 p-4 rounded-xl text-sm">
          <h3 className="font-bold mb-2 text-green-800">
            Informations du Propriétaire
          </h3>
          <p className="mb-2 text-green-800">
            Nom : {jardin.utilisateur?.nom}
          </p>
          <p className="mb-2 text-green-800">✅ Statut vérifié</p>
          <button className="mt-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded">
            Contacter
          </button>
        </div>
      </div>

      {/* Infos jardin */}
      <div className="mb-6">
        <h2 className="font-bold text-lg mb-2 text-green-800">
          Informations du Jardin
        </h2>
        <p className="text-sm text-green-800">{jardin.description}</p>
        <p className="text-sm text-green-800">Adresse : {jardin.adresse}</p>
        <p className="text-sm text-green-800">Type : {jardin.type}</p>
        <p className="text-sm text-green-800">Besoins : {jardin.besoins}</p>
        <p className="text-sm text-green-800">
          Publié le :{" "}
          {new Date(jardin.date_publication).toLocaleDateString("fr-FR")}
        </p>
        <p className="text-sm text-green-800">
          Note moyenne : {jardin.note_moyenne ?? "Pas encore de note"}
        </p>
      </div>

      {/* Réservation */}
      <div className="mb-6">
        <h2 className="font-bold text-lg mb-2 text-green-800">
          Choisissez une date
        </h2>
        <div className="flex flex-col items-center">
          <DatePicker
            selected={selectedDate}
            onChange={(d) => setSelectedDate(d)}
            inline
            minDate={new Date()}
            calendarClassName="rounded-lg border border-green-300 p-2"
          />
          <button
            disabled={!selectedDate}
            onClick={handleReservation}
            className={`mt-4 font-semibold px-6 py-2 rounded-full transition ${
              selectedDate
                ? "bg-pink-600 hover:bg-pink-700 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Réserver
          </button>
        </div>
      </div>

      {/* Commentaires */}
      <div>
        <h2 className="font-bold text-lg mb-2 text-green-800">Commentaires</h2>
        <div className="bg-gray-100 p-4 rounded-xl text-sm">
          ( Zone de commentaires à venir )
        </div>
      </div>
    </div>
  );
}
