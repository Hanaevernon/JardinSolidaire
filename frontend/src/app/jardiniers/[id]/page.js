"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
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
  // Fonction pour gérer la réservation
  const handleReservation = () => {
    if (!reservationDate) {
      alert("⚠️ Veuillez sélectionner une date avant de réserver.");
      return;
    }
    router.push(
      `/reservation_jardiniers?id=${id}&date=${reservationDate.toISOString()}`
    );
  };

  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [jardinier, setJardinier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservationDate, setReservationDate] = useState(null);
    const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [showContact, setShowContact] = useState(false);
  const [newCompetence, setNewCompetence] = useState("");
  const [competences, setCompetences] = useState([]);

  // Récupérer le jardinier
  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/jardiniers/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setJardinier(data);
          setDisponibilites(data.disponibilites_jardinier || []);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [id]);

  // Récupérer les compétences depuis l’API
  const fetchCompetences = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utilisateur/${jardinier.id_utilisateur}/competences`);
      if (!res.ok) throw new Error("Erreur récupération compétences");
      const data = await res.json();
      setCompetences(data);
    } catch (err) {
      setCompetences([]);
    }
  };

  // Charger les compétences quand le jardinier est prêt
  useEffect(() => {
    if (jardinier && jardinier.id_utilisateur) {
      fetchCompetences();
    }
  }, [jardinier]);

  // Ajout d'une compétence
  const handleAddCompetence = async () => {
    if (!newCompetence.trim()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utilisateur/${jardinier.id_utilisateur}/competences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: newCompetence.trim() })
      });
      if (!res.ok) throw new Error("Erreur ajout compétence");
      fetchCompetences();
      setNewCompetence("");
    } catch (err) {
      alert("Erreur lors de l'ajout de la compétence");
    }
  };

  // Suppression d'une compétence
  const handleRemoveCompetence = async (id_competence) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utilisateur/${jardinier.id_utilisateur}/competences/${id_competence}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Erreur suppression compétence");
      fetchCompetences();
    } catch (err) {
      alert("Erreur lors de la suppression de la compétence");
    }
  };

  // Les returns conditionnels doivent être APRES tous les hooks et la logique
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
          <p className="text-lg font-semibold text-green-700 mb-1">{jardinier.prenom} {jardinier.nom}</p>
          <p className="text-sm text-gray-600 font-semibold mb-1">{jardinier.description}</p>
          <p className="text-sm text-gray-600 font-semibold mb-1">📍 {jardinier.localisation}</p>
          {jardinier.email && <p className="text-sm text-gray-600 font-semibold mb-1">✉️ {jardinier.email}</p>}
          {jardinier.telephone && <p className="text-sm text-gray-600 font-semibold mb-1">📞 {jardinier.telephone}</p>}
          {jardinier.note_moyenne && <p className="text-sm text-gray-600 font-semibold mb-1">⭐ {jardinier.note_moyenne}</p>}
          {jardinier.biographie && <p className="text-sm text-gray-600 font-semibold mb-1">📝 {jardinier.biographie}</p>}
          <div className="mt-2">
            <p className="text-sm text-pink-700 font-semibold mb-1">🌱 Compétences :</p>
            <ul className="mb-2">
              {competences.map((comp, idx) => (
                <li key={comp.id_competence || idx} className="flex items-center gap-2 mb-1">
                  <span>{comp.nom}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Bouton contacter */}
          <button
            className="mt-3 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded"
            onClick={() => setShowContact((v) => !v)}
          >
            Contacter
          </button>
          {showContact && (
            <div className="mt-3 p-3 bg-white border rounded shadow text-gray-800">
              {jardinier.email || jardinier.telephone ? (
                <>
                  {jardinier.email && (
                    <p className="mb-1">Email : <a href={`mailto:${jardinier.email}`} className="text-green-700 underline">{jardinier.email}</a></p>
                  )}
                  {jardinier.telephone && (
                    <p className="mb-1">Téléphone : <a href={`tel:${jardinier.telephone}`} className="text-green-700 underline">{jardinier.telephone}</a></p>
                  )}
                  <hr className="my-2" />
                </>
              ) : null}
              <Link
                href={`/messagerie?to=${jardinier.id_utilisateur}&nom=${encodeURIComponent(`${jardinier.prenom || ''} ${jardinier.nom || ''}`.trim())}&id_jardinier=${jardinier.id_jardinier}`}
                className="inline-block mt-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => setShowContact(false)}
              >
                Envoyer un message
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 📅 Sélection de la date */}
      <div className="my-6">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          Choisissez une date :
        </h2>
        <DatePicker
          selected={reservationDate}
          onChange={(date) => {
            const isoDate = date.toISOString().slice(0, 10);
            const isDispo = disponibilites.some(d => d.date_dispo?.slice(0, 10) === isoDate);
            if (isDispo) {
              setReservationDate(date);
              setSelectedCreneau(null);
            }
          }}
          inline
          minDate={new Date()}
          dayClassName={date => {
            const isoDate = date.toISOString().slice(0, 10);
            const isDispo = disponibilites.some(d => d.date_dispo?.slice(0, 10) === isoDate);
            return isDispo
              ? 'react-datepicker__day--selected bg-green-200 text-green-900 font-bold rounded-full'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed';
          }}
        />
        <style jsx global>{`
          .react-datepicker__day--selected.bg-green-200 {
            background-color: #bbf7d0 !important;
            color: #166534 !important;
            border-radius: 50%;
            font-weight: bold;
          }
          .react-datepicker__day.bg-gray-100 {
            background-color: #f3f4f6 !important;
            color: #9ca3af !important;
            border-radius: 50%;
          }
        `}</style>
        {/* Affichage des créneaux horaires pour la date sélectionnée */}
        {reservationDate && (
          <div className="mt-6">
            <h3 className="text-md font-semibold text-green-700 mb-2">Créneaux disponibles pour le {reservationDate.toLocaleDateString()} :</h3>
            {(() => {
              const isoDate = reservationDate.toISOString().slice(0, 10);
              const creneaux = disponibilites.filter(d => d.date_dispo?.slice(0, 10) === isoDate);
              if (creneaux.length === 0) {
                return <p className="text-gray-500">Aucun créneau disponible ce jour.</p>;
              }
              return (
                <ul className="ml-2">
                  {creneaux.map((cr, idx) => (
                    <li key={idx} className="mb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="creneau"
                          value={cr.id_disponibilite || `${cr.heure_debut}-${cr.heure_fin}`}
                          checked={selectedCreneau === (cr.id_disponibilite || `${cr.heure_debut}-${cr.heure_fin}`)}
                          onChange={() => setSelectedCreneau(cr.id_disponibilite || `${cr.heure_debut}-${cr.heure_fin}`)}
                        />
                        <span className="text-gray-700">{cr.heure_debut?.slice(0,5)} - {cr.heure_fin?.slice(0,5)}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              );
            })()}
          </div>
        )}
      </div>

            {/* Affichage des disponibilités et plages horaires */}
            {/* <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold text-green-800 mb-2">Disponibilités du jardinier</h2>
              {disponibilites && disponibilites.length > 0 ? (
                <ul className="ml-2">
                  {disponibilites.map((dispo, idx) => (
                    <li key={idx} className="mb-2">
                      <span className="font-bold text-green-700">{new Date(dispo.date_dispo).toLocaleDateString()}</span>
                      {dispo.heure_debut && dispo.heure_fin && (
                        <span className="ml-2 text-gray-700">{dispo.heure_debut.slice(0,5)} - {dispo.heure_fin.slice(0,5)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucune disponibilité renseignée.</p>
              )}
            </div> */}
      <button
        onClick={() => {
          if (!reservationDate) {
            alert("⚠️ Veuillez sélectionner une date avant de réserver.");
            return;
          }
          if (!selectedCreneau) {
            alert("⚠️ Veuillez sélectionner un créneau horaire.");
            return;
          }
          router.push(
            `/reservation_jardiniers?id=${id}&date=${reservationDate.toISOString()}&creneau=${selectedCreneau}`
          );
        }}
        className="mt-4 bg-[#e3107d] hover:bg-pink-800 text-white px-6 py-3 rounded-full font-semibold transition"
      >
        Réserver ce jardinier
      </button>
    </div>
  );
}
