"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Slider from "react-slick";

function ArrowLeft(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ ...style, display: "block", left: 10, zIndex: 2, background: "rgba(255,255,255,0.7)", borderRadius: "50%" }}
      onClick={onClick}
      aria-label="Précédent"
    >
      <span style={{ fontSize: 24, color: '#16a34a' }}>{'‹'}</span>
    </button>
  );
}

function ArrowRight(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ ...style, display: "block", right: 10, zIndex: 2, background: "rgba(255,255,255,0.7)", borderRadius: "50%" }}
      onClick={onClick}
      aria-label="Suivant"
    >
      <span style={{ fontSize: 24, color: '#16a34a' }}>{'›'}</span>
    </button>
  );
}
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
  const [showContact, setShowContact] = useState(false);

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

  const photos = Array.isArray(jardin.photos) ? jardin.photos.slice(0, 5) : [];

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
          {photos.length > 0 ? (
            <Slider
              dots={true}
              infinite={photos.length > 1}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              className="mb-4"
              prevArrow={<ArrowLeft />}
              nextArrow={<ArrowRight />}
            >
              {photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Photo ${idx + 1}`}
                  className="rounded-lg w-full h-64 object-cover"
                />
              ))}
            </Slider>
          ) : (
            <img
              src="/assets/default.jpg"
              alt="Image par défaut"
              className="rounded-lg w-full h-64 object-cover mb-4"
            />
          )}
        </div>

        {/* Infos propriétaire */}
        <div className="bg-gray-100 p-4 rounded-xl text-sm">
          <h3 className="font-bold mb-2 text-green-800">
            Informations du Propriétaire
          </h3>
          <p className="mb-2 text-green-800">
            Nom : {jardin.utilisateur?.prenom} {jardin.utilisateur?.nom}
          </p>
          <p className="mb-2 text-green-800">✅ Statut vérifié</p>
          <button
            className="mt-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded"
            onClick={() => setShowContact((v) => !v)}
          >
            Contacter
          </button>
          {showContact && (
            <div className="mt-3 p-3 bg-white border rounded shadow text-gray-800">
              {jardin.utilisateur?.email || jardin.utilisateur?.telephone ? (
                <>
                  {jardin.utilisateur?.email && (
                    <p className="mb-1">Email : <a href={`mailto:${jardin.utilisateur.email}`} className="text-green-700 underline">{jardin.utilisateur.email}</a></p>
                  )}
                  {jardin.utilisateur?.telephone && (
                    <p className="mb-1">Téléphone : <a href={`tel:${jardin.utilisateur.telephone}`} className="text-green-700 underline">{jardin.utilisateur.telephone}</a></p>
                  )}
                  <hr className="my-2" />
                </>
              ) : null}
              <Link
                href={`/messagerie?to=${jardin.utilisateur?.id_utilisateur}&nom=${encodeURIComponent(`${jardin.utilisateur?.prenom || ''} ${jardin.utilisateur?.nom || ''}`.trim())}`}
                className="inline-block mt-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => setShowContact(false)}
              >
                Envoyer un message
              </Link>
            </div>
          )}
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
