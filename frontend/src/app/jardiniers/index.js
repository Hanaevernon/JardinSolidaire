"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Fonction utilitaire pour formater correctement l’URL de la photo
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

  // ✅ Si c'est une URL externe, on la retourne telle quelle
  if (p.startsWith('http://') || p.startsWith('https://')) {
    return p;
  }
  // Sinon, on retourne l'URL locale
  return `/assets/${p}`;
}


export default function ListeJardiniers() {
  const [jardiniers, setJardiniers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jardiniers`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setJardiniers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Erreur chargement jardiniers :", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 mt-20">⏳ Chargement...</p>;
  }

  return (
    <div className="min-h-screen px-[10%] py-24 bg-white">
      <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
        Nos amis du vert 🌿
      </h1>

      {jardiniers.length === 0 ? (
        <p className="text-center text-gray-600">
          Aucun jardinier disponible pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jardiniers.map((jardinier) => (
            <div
              key={jardinier.id_jardinier || jardinier.id_utilisateur}
              className="bg-white border rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              {/* Image */}
              <img
                src={getPhotoUrl(jardinier.photos)}
                alt={jardinier.titre || "Jardinier"}
                className="w-full h-48 object-cover"
              />

              {/* Contenu */}
              <div className="p-5 space-y-2">
                <h2 className="text-lg font-bold text-green-700">
                  {jardinier.titre}
                </h2>
                <p className="text-sm text-gray-600">
                  {jardinier.localisation || "Localisation inconnue"}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {jardinier.description}
                </p>
                <p className="text-xs text-pink-700 font-medium">
                  {jardinier.competences}
                </p>

                {/* Bouton voir plus */}
                <Link href={`/jardiniers/${jardinier.id_jardinier}`}>
                  <button className="mt-3 bg-[#e3107d] hover:bg-pink-800 text-white text-sm font-medium px-4 py-2 rounded-full transition">
                    Voir plus
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
