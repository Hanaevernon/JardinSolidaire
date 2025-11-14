"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function MesFavoris() {
  const { user } = useAuth();
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/favoris/${user.id_utilisateur}`)
      .then((res) => res.json())
      .then((data) => {
        setFavoris(data || []);
        setLoading(false);
      })
      .catch(() => setFavoris([]));
  }, [user]);

  if (!user) {
    return <div className="p-10 text-center">Veuillez vous connecter pour voir vos favoris.</div>;
  }

  if (loading) {
    return <div className="p-10 text-center">Chargement...</div>;
  }

  // Séparation selon le rôle
  const favorisJardins = favoris.filter(f => f.jardin);
  const favorisJardiniers = favoris.filter(f => f.jardinier);

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
     <h1 className="text-3xl font-bold mb-8 text-center text-green-800 mt-20">Mes Favoris</h1>
      {user.role === "ami_du_vert" ? (
        <>
          <h2 className="text-xl font-semibold mb-4 text-green-700">Jardins favoris</h2>
          {favorisJardins.length === 0 ? (
            <p className="text-gray-500">Aucun jardin en favori.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favorisJardins.map(fav => (
                <Link key={fav.jardin.id_jardin} href={`/jardins/${fav.jardin.id_jardin}`} className="block">
                  <div className="bg-green-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
                    <img src={Array.isArray(fav.jardin.photos) && fav.jardin.photos.length > 0 ? `/assets/${fav.jardin.photos[0].replace(/^assets\//, "")}` : "/assets/default.jpg"} alt="Jardin" className="h-40 w-full object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-green-900">{fav.jardin.titre}</h3>
                      <p className="text-sm text-gray-700">{fav.jardin.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4 text-green-700">Jardiniers favoris</h2>
          {favorisJardiniers.length === 0 ? (
            <p className="text-gray-500">Aucun jardinier en favori.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favorisJardiniers.map(fav => (
                <Link key={fav.jardinier.id_jardinier} href={`/jardiniers/${fav.jardinier.id_jardinier}`} className="block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
                    <img src={Array.isArray(fav.jardinier.photos) && fav.jardinier.photos.length > 0 ? `/assets/${fav.jardinier.photos[0].replace(/^assets\//, "")}` : "/assets/default.jpg"} alt="Jardinier" className="h-40 w-full object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-green-900">{fav.jardinier.titre}</h3>
                      <p className="text-sm text-gray-700">{fav.jardinier.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
