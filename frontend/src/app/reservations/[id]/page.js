"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarAlt,
  faSeedling,
  faUser,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const ReservationDetailPage = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    if (id) {
      fetchReservationDetails();
    }
  }, [id]);

  const fetchReservationDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reservations/${id}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setReservation(data);
      } else {
        console.error("Erreur lors de la récupération de la réservation");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reservations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statut: newStatus }),
        }
      );

      if (response.ok) {
        setReservation(prev => ({ ...prev, statut: newStatus }));
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Réservation non trouvée</p>
          <Link href="/profile">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              Retour au profil
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmee":
        return "bg-green-100 text-green-800 border-green-200";
      case "en_attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "annulee":
        return "bg-red-100 text-red-800 border-red-200";
      case "refusee":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex items-center mb-6">
          <Link href="/demandes-recues" className="mr-4">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Retour
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Détails de la réservation</h1>
        </div>

        {/* Informations de la réservation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600 text-2xl mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Réservation #{reservation.id_reservation}
                </h2>
                <p className="text-gray-600">
                  Créée le {new Date(reservation.date_reservation).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full border ${getStatusColor(reservation.statut)}`}>
              <span className="font-medium capitalize">{reservation.statut}</span>
            </div>
          </div>


          {/* Affichage dynamique selon le type de réservation */}
          {/* Si id_jardin est null, c'est une réservation d'un jardinier (Ami du vert) */}
          {reservation.id_jardin === null ? (
            <div className="col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
                Ami du vert réservé
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">Les informations du jardinier réservé ne sont pas disponibles dans cette version.<br/>Merci de contacter l'administrateur pour améliorer l'affichage.</p>
              </div>
            </div>
          ) : (
            // Cas réservation d'un jardin
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FontAwesomeIcon icon={faSeedling} className="mr-2 text-green-600" />
                  Jardin réservé
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    {reservation.titre_annonce || "Titre non disponible"}
                  </h4>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    <span>{reservation.adresse || "Adresse non disponible"}</span>
                  </div>
                  <div className="text-gray-600">
                    <strong>Type:</strong> {reservation.type || "Non spécifié"}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
                  Propriétaire
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    {reservation.proprietaire_prenom} {reservation.proprietaire_nom}
                  </h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faEnvelope} className="mr-2 w-4" />
                      <span>Contact disponible après confirmation</span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faPhone} className="mr-2 w-4" />
                      <span>Téléphone disponible après confirmation</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          </div>

          {/* Dates de réservation */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Période et horaires réservés
            </h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Date de début</p>
                  <p className="text-lg font-medium text-gray-800">
                    {reservation.date_debut
                      ? new Date(reservation.date_debut).toLocaleDateString()
                      : reservation.date_reservation
                        ? new Date(reservation.date_reservation).toLocaleDateString()
                        : "Non spécifiée"}
                  </p>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Date de fin</p>
                  <p className="text-lg font-medium text-gray-800">
                    {reservation.date_fin
                      ? new Date(reservation.date_fin).toLocaleDateString()
                      : reservation.date_reservation
                        ? new Date(reservation.date_reservation).toLocaleDateString()
                        : "Non spécifiée"}
                  </p>
                </div>
              </div>
              {/* Créneaux horaires réservés */}
              {reservation.creneaux && reservation.creneaux.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">Horaires réservés :</p>
                  <ul className="list-disc list-inside text-green-700">
                    {reservation.creneaux.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Commentaires */}
          {reservation.commentaires && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-green-600" />
                Commentaires
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{reservation.commentaires}</p>
              </div>
            </div>
          )}

          {/* Actions selon le rôle et le statut */}
          <div className="mt-6 flex justify-end space-x-4">
            {currentUser && reservation.statut === "en_attente" && (
              <>
                {/* Actions pour le jardinier (qui a fait la réservation) */}
                {currentUser.id_utilisateur === reservation.id_utilisateur && (
                  <button
                    onClick={() => updateReservationStatus("annulee")}
                    disabled={updating}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    {updating ? "Annulation..." : "Annuler ma réservation"}
                  </button>
                )}

                {/* Actions pour le propriétaire (qui reçoit la réservation) */}
                {currentUser.role === "proprietaire" && currentUser.id_utilisateur !== reservation.id_utilisateur && (
                  <>
                    <button
                      onClick={() => updateReservationStatus("refusee")}
                      disabled={updating}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-2" />
                      {updating ? "Refus..." : "Refuser"}
                    </button>
                    <button
                      onClick={() => updateReservationStatus("confirmee")}
                      disabled={updating}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      {updating ? "Confirmation..." : "Accepter"}
                    </button>
                  </>
                )}
              </>
            )}
            
            {/* Messages de statut */}
            {reservation.statut === "confirmee" && (
              <div className="text-green-600 flex items-center">
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                <span>Réservation confirmée</span>
              </div>
            )}
            
            {reservation.statut === "annulee" && (
              <div className="text-red-600 flex items-center">
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                <span>Réservation annulée</span>
              </div>
            )}

            {reservation.statut === "refusee" && (
              <div className="text-red-600 flex items-center">
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                <span>Réservation refusée</span>
              </div>
            )}

            {/* Si l'utilisateur n'a pas les droits pour agir */}
            {currentUser && reservation.statut === "en_attente" && 
             currentUser.id_utilisateur !== reservation.id_utilisateur && 
             currentUser.role !== "proprietaire" && (
              <div className="text-gray-600 flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                <span>En attente de validation</span>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ReservationDetailPage;