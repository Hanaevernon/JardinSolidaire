"use client";
import { useEffect, useState } from "react";
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
      if (userData.role === "proprietaire") {
        const annoncesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/annonces/proprietaire/${userId}`
        );
        const annoncesData = await annoncesResponse.json();
        setAnnonces(Array.isArray(annoncesData) ? annoncesData : []);
      } else if (userData.role === "ami_du_vert") {
        const annoncesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/annonces/jardinier/${userId}`
        );
        const annoncesData = await annoncesResponse.json();
        setAnnonces(Array.isArray(annoncesData) ? annoncesData : []);
      }

      // Récupérer les réservations
      const reservationsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reservations/utilisateur/${userId}`
      );
      const reservationsData = await reservationsResponse.json();
      setReservations(Array.isArray(reservationsData) ? reservationsData : []);

      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      setLoading(false);
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
                  <span>{userDetails.ville || "Ville non renseignée"}</span>
                </div>
              </div>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Modifier le profil
            </button>
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
                  {new Date(userDetails.date_creation).toLocaleDateString()}
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
                : "Mes annonces de jardinage"}
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
                    : "Vous n'avez pas encore publié d'annonce"}
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                  {userDetails.role === "proprietaire"
                    ? "Ajouter mon jardin"
                    : "Créer une annonce"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(annonces) && annonces.map((annonce) => (
                  <div
                    key={annonce.id_annonce}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {annonce.titre}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {annonce.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium">
                        {annonce.prix}€
                      </span>
                      <button className="text-green-600 hover:text-green-700 text-sm">
                        Voir détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Réservations */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-green-600" />
            Mes réservations
          </h2>
          
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-gray-300 text-4xl mb-4"
              />
              <p className="text-gray-500">Aucune réservation pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Jardin</th>
                    <th className="px-4 py-2 text-left">Dates</th>
                    <th className="px-4 py-2 text-left">Prix</th>
                    <th className="px-4 py-2 text-left">Statut</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(reservations) && reservations.map((reservation) => (
                    <tr key={reservation.id_reservation} className="border-b">
                      <td className="px-4 py-3">{reservation.titre_annonce}</td>
                      <td className="px-4 py-3">
                        {new Date(reservation.date_debut).toLocaleDateString()} -{" "}
                        {new Date(reservation.date_fin).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{reservation.montant_total}€</td>
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
                          {reservation.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-green-600 hover:text-green-700 text-sm">
                          Voir détails
                        </button>
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
              <p className="text-gray-600">Annonces publiées</p>
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
};

export default ProfilePage;