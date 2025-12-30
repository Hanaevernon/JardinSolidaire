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
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const DemandesRecuesPage = () => {
  const [user, setUser] = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Autoriser propriétaire ET ami_du_vert
      if (userData.role !== "proprietaire" && userData.role !== "ami_du_vert") {
        window.location.href = "/";
        return;
      }

      // Appel API selon le rôle
      if (userData.role === "proprietaire") {
        fetchDemandes(userData.id_utilisateur, "proprietaire");
      } else if (userData.role === "ami_du_vert") {
        fetchDemandes(userData.id_utilisateur, "jardinier");
      }
    } else {
      window.location.href = "/connexion";
    }
  }, []);

  // roleType = "proprietaire" ou "jardinier"
  const fetchDemandes = async (userId, roleType) => {
    try {
      let url = "";
      if (roleType === "proprietaire") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/reservations/proprietaire/${userId}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/reservations/jardinier/${userId}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setDemandes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDemandeStatus = async (reservationId, newStatus) => {
    setUpdating(reservationId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reservations/${reservationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statut: newStatus }),
        }
      );

      if (response.ok) {
        // Mettre à jour le statut localement
        setDemandes(prev => 
          prev.map(demande => 
            demande.id_reservation === reservationId 
              ? { ...demande, statut: newStatus }
              : demande
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setUpdating(null);
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

  // Séparer les demandes par statut
  const demandesEnAttente = demandes.filter(d => d.statut === "en_attente");
  const autresDemandes = demandes.filter(d => d.statut !== "en_attente");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Demandes de réservation reçues
          </h1>
          <p className="text-gray-600">
            Gérez les demandes de réservation pour vos jardins
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-yellow-600 text-2xl mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{demandesEnAttente.length}</h3>
            <p className="text-gray-600">En attente</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FontAwesomeIcon icon={faCheck} className="text-green-600 text-2xl mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">
              {demandes.filter(d => d.statut === "confirmee").length}
            </h3>
            <p className="text-gray-600">Confirmées</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FontAwesomeIcon icon={faTimes} className="text-red-600 text-2xl mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">
              {demandes.filter(d => d.statut === "refusee" || d.statut === "annulee").length}
            </h3>
            <p className="text-gray-600">Refusées/Annulées</p>
          </div>
        </div>

        {/* Demandes en attente (priorité) */}
        {demandesEnAttente.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faInfoCircle} className="text-yellow-600 mr-2" />
              Demandes en attente ({demandesEnAttente.length})
            </h2>
            <div className="space-y-4">
              {demandesEnAttente.map((demande) => (
                <div
                  key={demande.id_reservation}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <FontAwesomeIcon 
                          icon={faSeedling} 
                          className="text-green-600 mr-3" 
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {demande.titre_annonce || "Jardin"}
                        </h3>
                        <span className="ml-3 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Nouvelle demande
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faUser} className="mr-2 w-4" />
                            <span className="font-medium">
                              {demande.client_prenom} {demande.client_nom}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2 w-4" />
                            <span>{demande.client_email}</span>
                          </div>
                          {demande.client_telephone && (
                            <div className="flex items-center">
                              <FontAwesomeIcon icon={faPhone} className="mr-2 w-4" />
                              <span>{demande.client_telephone}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center mb-2">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 w-4" />
                            <span>Demande du {new Date(demande.date_reservation).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {demande.commentaires && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-600" />
                            <strong>Message :</strong> {demande.commentaires}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                      <button
                        onClick={() => updateDemandeStatus(demande.id_reservation, "refusee")}
                        disabled={updating === demande.id_reservation}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faTimes} className="mr-1" />
                        {updating === demande.id_reservation ? "..." : "Refuser"}
                      </button>
                      <button
                        onClick={() => updateDemandeStatus(demande.id_reservation, "confirmee")}
                        disabled={updating === demande.id_reservation}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faCheck} className="mr-1" />
                        {updating === demande.id_reservation ? "..." : "Accepter"}
                      </button>
                      <Link href={`/reservations/${demande.id_reservation}`}>
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

        {/* Historique des autres demandes */}
        {autresDemandes.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Historique des demandes ({autresDemandes.length})
            </h2>
            <div className="space-y-4">
              {autresDemandes.map((demande) => (
                <div
                  key={demande.id_reservation}
                  className="bg-white rounded-lg shadow-md p-6 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <FontAwesomeIcon 
                          icon={faSeedling} 
                          className="text-green-600 mr-3" 
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {demande.titre_annonce || "Jardin"}
                        </h3>
                        <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(demande.statut)}`}>
                          {getStatusText(demande.statut)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faUser} className="mr-2 w-4" />
                          <span>{demande.client_prenom} {demande.client_nom}</span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 w-4" />
                          <span>{new Date(demande.date_reservation).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center ml-4">
                      <Link href={`/reservations/${demande.id_reservation}`}>
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

        {/* Message si aucune demande */}
        {demandes.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="text-gray-300 text-6xl mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune demande de réservation
            </h2>
            <p className="text-gray-500">
              Vous n&apos;avez reçu aucune demande pour vos jardins pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandesRecuesPage;