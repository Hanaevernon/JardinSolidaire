
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faEdit,
  faSeedling,
  faHeart,
  faCalendarAlt,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchUserProfile(userData.id_utilisateur);
    } else {
      window.location.href = "/connexion";
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      // Récupérer les détails de l'utilisateur
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/utilisateur/${userId}`
      );
      const userData = await userResponse.json();
      setUserDetails(userData);

      // Récupérer les annonces selon le rôle
      console.log("Rôle de l'utilisateur:", userData.role);
      if (userData.role === "proprietaire") {
        const annoncesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/annonces/proprietaire/${userId}`
        );
        const annoncesData = await annoncesResponse.json();
        console.log("Annonces propriétaire reçues:", annoncesData);
        setAnnonces(Array.isArray(annoncesData) ? annoncesData : []);
      } else if (userData.role === "ami_du_vert") {
        // Pour les amis du vert, on peut récupérer leurs compétences à la place
        try {
          const competencesResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/utilisateur/${userId}/competences`
          );
          if (competencesResponse.ok) {
            const competencesData = await competencesResponse.json();
            console.log("Compétences ami du vert reçues:", competencesData);
            setAnnonces(Array.isArray(competencesData) ? competencesData : []);
          } else {
            // Si pas de route compétences, on garde un tableau vide pour l'instant
            setAnnonces([]);
          }
        } catch (error) {
          console.log("Pas de compétences définies, tableau vide");
          setAnnonces([]);
        }
      }

      // Récupérer les réservations selon le rôle
      let reservationsUrl;
      if (userData.role === "proprietaire") {
        // Pour les propriétaires : récupérer les demandes reçues
        reservationsUrl = `${process.env.NEXT_PUBLIC_API_URL}/reservations/proprietaire/${userId}`;
      } else {
        // Pour les jardiniers : récupérer leurs propres réservations
        reservationsUrl = `${process.env.NEXT_PUBLIC_API_URL}/reservations/utilisateur/${userId}`;
      }
      
      const reservationsResponse = await fetch(reservationsUrl);
      const reservationsData = await reservationsResponse.json();
      setReservations(Array.isArray(reservationsData) ? reservationsData : []);

      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      setLoading(false);
    }
  };

  // Suppression d'une annonce de jardin
  const supprimerAnnonce = async (id_jardin) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce jardin ?")) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jardins/${id_jardin}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAnnonces((prev) => prev.filter((a) => a.id_jardin !== id_jardin));
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (e) {
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSeedling}
            className="text-green-600 text-4xl mb-4 animate-spin"
          />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user || !userDetails) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <p className="text-red-600">Erreur lors du chargement du profil</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* En-tête du profil */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userDetails.prenom?.charAt(0)}
                {userDetails.nom?.charAt(0)}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-gray-800">
                  {userDetails.prenom} {userDetails.nom}
                </h1>
                <p className="text-lg text-green-600 font-medium">
                  {userDetails.role === "proprietaire"
                    ? "Propriétaire de jardin"
                    : "Ami du vert"}
                </p>
                <div className="flex items-center mt-2 text-gray-600">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  <span>{userDetails.adresse || "Adresse non renseignée"}</span>
                </div>
              </div>
            </div>
            <Link href="/profile/edit">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Modifier le profil
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
              Informations personnelles
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-gray-400 w-4" />
                <span className="text-gray-700">{userDetails.email}</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faPhone} className="mr-3 text-gray-400 w-4" />
                <span className="text-gray-700">
                  {userDetails.telephone || "Non renseigné"}
                </span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-gray-400 w-4" />
                <span className="text-gray-700">
                  Membre depuis{" "}
                  {new Date(userDetails.date_inscription).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Mes annonces */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faSeedling} className="mr-2 text-green-600" />
              {userDetails.role === "proprietaire"
                ? "Mes jardins"
                : "Mes compétences"}
            </h2>
            
            {annonces.length === 0 ? (
              <div className="text-center py-8">
                <FontAwesomeIcon
                  icon={faLeaf}
                  className="text-gray-300 text-4xl mb-4"
                />
                <p className="text-gray-500 mb-4">
                  {userDetails.role === "proprietaire"
                    ? "Vous n'avez pas encore publié de jardin"
                    : "Vous n'avez pas encore défini vos compétences"}
                </p>
                <Link href={userDetails.role === "proprietaire" ? "/ajouter-jardin" : "/je-veux-jardiner"}>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                    {userDetails.role === "proprietaire"
                      ? "Ajouter mon jardin"
                      : "Définir mes compétences"}
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(annonces) && annonces.map((item) => (
                  <div
                    key={item.id_jardin || item.id_competence || item.id_annonce || Math.random()}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {userDetails.role === "proprietaire" ? (
                      // Affichage pour les jardins
                      <>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {item.titre}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-green-600 font-medium">
                            {item.type || "Jardin"}
                          </span>
                          <div className="flex gap-2">
                            <Link href={`/jardins/${item.id_jardin}`}>
                              <button className="text-green-600 hover:text-green-700 text-sm">
                                Voir détails
                              </button>
                            </Link>
                            <Link href={`/modifier_jardin/${item.id_jardin}`}>
                              <button className="text-blue-600 hover:text-blue-700 text-sm">
                                Modifier
                              </button>
                            </Link>
                            <button
                              className="text-red-600 hover:text-red-700 text-sm"
                              onClick={() => supprimerAnnonce(item.id_jardin)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Affichage pour les compétences
                      <>
                        <div className="text-center py-4">
                          <FontAwesomeIcon icon={faLeaf} className="text-green-600 text-2xl mb-2" />
                          <h3 className="font-semibold text-gray-800">
                            {item.nom}
                          </h3>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Réservations */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-green-600" />
              {userDetails.role === "proprietaire" ? "Demandes reçues" : "Mes réservations"}
            </h2>
            {reservations.length > 0 && (
              <Link href="/reservations">
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Voir tout →
                </button>
              </Link>
            )}
          </div>
          
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-gray-300 text-4xl mb-4"
              />
              <p className="text-gray-500">
                {userDetails.role === "proprietaire" 
                  ? "Aucune demande de réservation reçue" 
                  : "Aucune réservation pour le moment"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-gray-700">
                      {userDetails.role === "proprietaire" ? "Jardin demandé" : "Jardin"}
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700">
                      {userDetails.role === "proprietaire" ? "Demandeur" : "Propriétaire"}
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-gray-700">Statut</th>
                    <th className="px-4 py-2 text-left text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(reservations) && reservations.map((reservation) => (
                    <tr key={reservation.id_reservation} className="border-b">
                      <td className="px-4 py-3 text-gray-700">{reservation.titre_annonce}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {userDetails.role === "proprietaire" 
                          ? `${reservation.client_prenom || ''} ${reservation.client_nom || ''}`.trim()
                          : `${reservation.proprietaire_prenom || ''} ${reservation.proprietaire_nom || ''}`.trim()
                        }
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {new Date(reservation.date_reservation).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            reservation.statut === "confirmee"
                              ? "bg-green-100 text-green-800"
                              : reservation.statut === "en_attente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {reservation.statut === "refusee" ? "refusée" : reservation.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/reservations/${reservation.id_reservation}`}>
                          <button className="text-green-600 hover:text-green-700 text-sm">
                            Voir détails
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistiques pour propriétaire */}
        {userDetails.role === "proprietaire" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <FontAwesomeIcon
                icon={faSeedling}
                className="text-green-600 text-3xl mb-2"
              />
              <h3 className="text-2xl font-bold text-gray-800">{annonces.length}</h3>
              <p className="text-gray-600">Jardins publiés</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-blue-600 text-3xl mb-2"
              />
              <h3 className="text-2xl font-bold text-gray-800">{reservations.length}</h3>
              <p className="text-gray-600">Réservations reçues</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-red-600 text-3xl mb-2"
              />
              <h3 className="text-2xl font-bold text-gray-800">0</h3>
              <p className="text-gray-600">Favoris reçus</p>
            </div>
          </div>
        )}

        {/* Statistiques pour ami du vert */}
        {userDetails.role === "ami_du_vert" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <FontAwesomeIcon
                icon={faLeaf}
                className="text-green-600 text-3xl mb-2"
              />
              <h3 className="text-2xl font-bold text-gray-800">{annonces.length}</h3>
              <p className="text-gray-600">Compétences définies</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-blue-600 text-3xl mb-2"
              />
              <h3 className="text-2xl font-bold text-gray-800">{reservations.length}</h3>
              <p className="text-gray-600">Jardins réservés</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-red-600 text-3xl mb-2"
              />
              <h3 className="text-2xl font-bold text-gray-800">0</h3>
              <p className="text-gray-600">Jardins favoris</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;