"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faSeedling,
  faUser,
  faCheck,
  faTimes,
  faInfoCircle,
  faEye,
  faPlus,
  faClock,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const MesReservationsPage = () => {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
  fetchReservations(userData.id_utilisateur);
    } else {
      window.location.href = "/connexion";
    }
  }, []);

  const fetchReservations = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reservations/utilisateur/${userId}`
      );
      const data = await response.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId) => {
    setCanceling(reservationId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reservations/${reservationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statut: "annulee" }),
        }
      );

      if (response.ok) {
        setReservations(prev =>
          prev.map(reservation =>
            reservation.id_reservation === reservationId
              ? { ...reservation, statut: "annulee" }
              : reservation
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
    } finally {
      setCanceling(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmee":
        return "bg-green-100 text-green-800";
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      case "annulee":
        return "bg-red-100 text-red-800";
      case "refusee":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmee":
        return "Confirmée";
      case "en_attente":
        return "En attente";
      case "annulee":
        return "Annulée";
      case "refusee":
        return "Refusée";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmee":
        return faCheck;
      case "en_attente":
        return faClock;
      case "annulee":
      case "refusee":
        return faTimes;
      default:
        return faInfoCircle;
    }
  };

  // Séparer les réservations par statut
  const reservationsEnAttente = reservations.filter(r => r.statut === "en_attente");
  const reservationsConfirmees = reservations.filter(r => r.statut === "confirmee");
  const reservationsTerminees = reservations.filter(r => 
    r.statut === "annulee" || r.statut === "refusee"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Mes réservations
            </h1>
            <p className="text-gray-600">
              Gérez vos réservations de jardins et services de jardinage
            </p>
          </div>
          <Link href="/jardins">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Nouvelle réservation
            </button>
          </Link>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FontAwesomeIcon icon={faClock} className="text-yellow-600 text-2xl mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{reservationsEnAttente.length}</h3>
            <p className="text-gray-600">En attente</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FontAwesomeIcon icon={faCheck} className="text-green-600 text-2xl mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{reservationsConfirmees.length}</h3>
            <p className="text-gray-600">Confirmées</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FontAwesomeIcon icon={faTimes} className="text-red-600 text-2xl mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{reservationsTerminees.length}</h3>
            <p className="text-gray-600">Terminées</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 text-2xl mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{reservations.length}</h3>
            <p className="text-gray-600">Total</p>
          </div>
        </div>

        {/* Réservations en attente */}
        {reservationsEnAttente.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faClock} className="text-yellow-600 mr-2" />
              En attente de confirmation ({reservationsEnAttente.length})
            </h2>
            <div className="space-y-4">
              {reservationsEnAttente.map((reservation) => (
                <div
                  key={reservation.id_reservation}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        {reservation.id_jardin === null ? (
                          <FontAwesomeIcon 
                            icon={faUser} 
                            className="text-green-600 mr-3 text-xl" 
                          />
                        ) : (
                          <FontAwesomeIcon 
                            icon={faSeedling} 
                            className="text-green-600 mr-3 text-xl" 
                          />
                        )}
                        <h3 className="text-lg font-semibold text-gray-800">
                          {reservation.id_jardin === null
                            ? "Ami du vert"
                            : (reservation.titre_annonce || "Jardin")}
                        </h3>
                        <span className="ml-3 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          <FontAwesomeIcon icon={faClock} className="mr-1" />
                          En attente
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faUser} className="mr-2 w-4" />
                            <span className="font-medium">
                              {reservation.id_jardin === null
                                ? `Ami du vert : ${reservation.jardinier_prenom ? reservation.jardinier_prenom : "Jardinier inconnu"}`
                                : `Propriétaire : ${reservation.proprietaire_prenom || ""} ${reservation.proprietaire_nom || ""}`}
                            </span>
                          </div>
                          {reservation.id_jardin === null ? null : (
                            reservation.proprietaire_adresse && (
                              <div className="flex items-start">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 w-4 mt-0.5" />
                                <span>{reservation.proprietaire_adresse}</span>
                              </div>
                            )
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center mb-2">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 w-4" />
                            <span>Demandé le {new Date(reservation.date_reservation).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {reservation.commentaires && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-600" />
                            <strong>Votre message :</strong> {reservation.commentaires}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                      <button
                        onClick={() => cancelReservation(reservation.id_reservation)}
                        disabled={canceling === reservation.id_reservation}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faTimes} className="mr-1" />
                        {canceling === reservation.id_reservation ? "..." : "Annuler"}
                      </button>
                      <Link href={`/reservations/${reservation.id_reservation}`}>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center">
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                          Détails
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Réservations confirmées */}
        {reservationsConfirmees.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2" />
              Confirmées ({reservationsConfirmees.length})
            </h2>
            <div className="space-y-4">
              {reservationsConfirmees.map((reservation) => (
                <div
                  key={reservation.id_reservation}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <FontAwesomeIcon 
                          icon={faSeedling} 
                          className="text-green-600 mr-3 text-xl" 
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {reservation.titre_annonce || "Jardin"}
                        </h3>
                        <span className="ml-3 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <FontAwesomeIcon icon={faCheck} className="mr-1" />
                          Confirmée
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faUser} className="mr-2 w-4" />
                          <span>{reservation.proprietaire_prenom} {reservation.proprietaire_nom}</span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 w-4" />
                          <span>{new Date(reservation.date_reservation).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center ml-4">
                      <Link href={`/reservations/${reservation.id_reservation}`}>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center">
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                          Voir détails
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historique */}
        {reservationsTerminees.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Historique ({reservationsTerminees.length})
            </h2>
            <div className="space-y-4">
              {reservationsTerminees.map((reservation) => (
                <div
                  key={reservation.id_reservation}
                  className="bg-white rounded-lg shadow-md p-6 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <FontAwesomeIcon 
                          icon={faSeedling} 
                          className="text-green-600 mr-3 text-xl" 
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {reservation.titre_annonce || "Jardin"}
                        </h3>
                        <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.statut)}`}>
                          <FontAwesomeIcon icon={getStatusIcon(reservation.statut)} className="mr-1" />
                          {getStatusText(reservation.statut)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faUser} className="mr-2 w-4" />
                          <span>{reservation.proprietaire_prenom} {reservation.proprietaire_nom}</span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 w-4" />
                          <span>{new Date(reservation.date_reservation).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center ml-4">
                      <Link href={`/reservations/${reservation.id_reservation}`}>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center">
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                          Détails
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message si aucune réservation */}
        {reservations.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="text-gray-300 text-6xl mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune réservation
            </h2>
            <p className="text-gray-500 mb-6">
              Vous n'avez pas encore effectué de réservation.
            </p>
            <Link href="/jardins">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Faire une réservation
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesReservationsPage;