
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

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProfilePage = () => {
      const [selectedDate, setSelectedDate] = useState(null);
      const [selectedHoraire, setSelectedHoraire] = useState(null);
    // State pour l’ajout de compétence
    const [newCompetence, setNewCompetence] = useState("");
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState([]);
  // Plages horaires par date : { 'YYYY-MM-DD': [{heureDebut, heureFin}, ...] }
  const [plagesHoraires, setPlagesHoraires] = useState({});
  const [savingDates, setSavingDates] = useState(false);
  const [jardinierAnnonce, setJardinierAnnonce] = useState(null);
  const [favoris, setFavoris] = useState([]);


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

      // Récupérer les favoris
      try {
        const favorisResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favoris/${userId}`);
        if (favorisResponse.ok) {
          const favorisData = await favorisResponse.json();
          setFavoris(Array.isArray(favorisData) ? favorisData : []);
        } else {
          setFavoris([]);
        }
      } catch (error) {
        setFavoris([]);
      }

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
  
  useEffect(() => {
    if (userDetails?.role === "ami_du_vert") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/jardiniers?userId=${userDetails.id_utilisateur}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setJardinierAnnonce(data[0]);
            if (data[0].disponibilites) {
              try {
                const dispo = JSON.parse(data[0].disponibilites);
                // dispo = [{date: 'YYYY-MM-DD', plages: [{heureDebut, heureFin}]}]
                setSelectedDates(dispo.map(d => new Date(d.date)));
                const plages = {};
                dispo.forEach(d => { plages[d.date] = d.plages || []; });
                setPlagesHoraires(plages);
              } catch {
                setSelectedDates([]);
                setPlagesHoraires({});
              }
            }
          }
        });
    }
  }, [userDetails]);
  
  const handleSaveDates = async () => {
  if (!jardinierAnnonce || selectedDates.length === 0) return;
  setSavingDates(true);
  try {
    // Format [{date: 'YYYY-MM-DD', plages: [{heureDebut, heureFin}]}]
    const dispoToSave = selectedDates.map(d => {
      const dateStr = d.toISOString().slice(0, 10);
      return {
        date: dateStr,
        plages: plagesHoraires[dateStr] || []
      };
    });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disponibilites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_jardinier: jardinierAnnonce.id_jardinier,
        disponibilites: dispoToSave
      })
    });
    if (!res.ok) throw new Error("Erreur sauvegarde disponibilités");
    // Optionnel : feedback utilisateur ou rechargement
  } catch (err) {
    alert("Erreur lors de la sauvegarde des disponibilités");
  } finally {
    setSavingDates(false);
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
                {/* Ajout/Suppression compétences pour ami_du_vert */}
                {userDetails.role === "ami_du_vert" && (
                  <div className="mb-4 flex gap-2 items-center">
                    <input
                      type="text"
                      value={newCompetence}
                      onChange={e => setNewCompetence(e.target.value)}
                      placeholder="Ajouter une compétence"
                      className="border px-2 py-1 rounded"
                    />
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded"
                      onClick={async () => {
                        if (!newCompetence.trim()) return;
                        try {
                          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utilisateur/${userDetails.id_utilisateur}/competences`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ nom: newCompetence.trim() })
                          });
                          if (!res.ok) throw new Error("Erreur ajout compétence");
                          setNewCompetence("");
                          // Recharger les compétences
                          fetchUserProfile(userDetails.id_utilisateur);
                        } catch (err) {
                          alert("Erreur lors de l'ajout de la compétence");
                        }
                      }}
                    >Ajouter</button>
                  </div>
                )}
                {Array.isArray(annonces) && annonces.map((item) => (
                  <div
                    key={item.id_jardin || item.id_competence || item.id_annonce || Math.random()}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between"
                  >
                    {userDetails.role === "proprietaire" ? (
                      // ...affichage jardins inchangé...
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
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faLeaf} className="text-green-600 text-2xl" />
                          <span className="font-semibold text-gray-800">{item.nom}</span>
                        </div>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                          onClick={async () => {
                            try {
                              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utilisateur/${userDetails.id_utilisateur}/competences/${item.id_competence}`, {
                                method: "DELETE"
                              });
                              if (!res.ok) throw new Error("Erreur suppression compétence");
                              // Recharger les compétences
                              fetchUserProfile(userDetails.id_utilisateur);
                            } catch (err) {
                              alert("Erreur lors de la suppression de la compétence");
                            }
                          }}
                        >Supprimer</button>
                      </div>
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
              <h3 className="text-2xl font-bold text-gray-800">{favoris.length}</h3>
              <p className="text-gray-600">Favoris reçus</p>
            </div>
          </div>
        )}

        {/* Statistiques pour ami du vert */}
        {userDetails.role === "ami_du_vert" && (
          <>
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
                <h3 className="text-2xl font-bold text-gray-800">{favoris.length}</h3>
                <p className="text-gray-600">Jardins favoris</p>
              </div>
            </div>

            {/* Encart calendrier de disponibilités */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-green-600" />
                Mes disponibilités
              </h2>
              <p className="text-gray-600 mb-4">Cliquez sur une date pour voir/modifier les horaires disponibles. Les dates en vert sont vos disponibilités.</p>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                inline
                minDate={new Date()}
                dayClassName={date => {
                  const dateStr = date.toISOString().slice(0, 10);
                  return plagesHoraires[dateStr]?.length > 0
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
              {/* Affichage des horaires pour la date sélectionnée */}
              <div className="mt-4">
                {selectedDate ? (
                  (() => {
                    const dateStr = selectedDate.toISOString().slice(0, 10);
                    const horaires = plagesHoraires[dateStr] || [];
                    return (
                      <>
                        <h3 className="font-semibold text-gray-700 mb-2">Horaires pour le {selectedDate.toLocaleDateString()} :</h3>
                        {horaires.length > 0 ? (
                          <ul className="ml-2">
                            {horaires.map((plage, i) => (
                              <li key={i} className="mb-2 flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="horaire"
                                  value={`${plage.heureDebut}-${plage.heureFin}`}
                                  checked={selectedHoraire === `${plage.heureDebut}-${plage.heureFin}`}
                                  onChange={() => setSelectedHoraire(`${plage.heureDebut}-${plage.heureFin}`)}
                                />
                                <span className="text-gray-700">{plage.heureDebut} - {plage.heureFin}</span>
                                <button className="text-red-500 text-xs" onClick={() => {
                                  setPlagesHoraires(prev => {
                                    const arr = [...(prev[dateStr] || [])];
                                    arr.splice(i, 1);
                                    return {...prev, [dateStr]: arr};
                                  });
                                }}>Supprimer</button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">Aucun horaire pour cette date.</p>
                        )}
                        <PlageHoraireForm
                          onAdd={(heureDebut, heureFin) => {
                            setPlagesHoraires(prev => {
                              const arr = [...(prev[dateStr] || [])];
                              arr.push({heureDebut, heureFin});
                              return {...prev, [dateStr]: arr};
                            });
                          }}
                        />
                        <button
                          className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-xs"
                          onClick={() => {
                            setSelectedDates(prev => prev.filter(d => d.toISOString().slice(0, 10) !== dateStr));
                            setPlagesHoraires(prev => {
                              const newPlages = {...prev};
                              delete newPlages[dateStr];
                              return newPlages;
                            });
                            setSelectedDate(null);
                          }}
                        >Supprimer cette date</button>
                      </>
                    );
                  })()
                ) : (
                  <p className="text-gray-500">Cliquez sur une date pour voir/modifier les horaires.</p>
                )}
                <button
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  onClick={handleSaveDates}
                  disabled={savingDates || !jardinierAnnonce}
                >
                  {savingDates ? "Sauvegarde..." : "Sauvegarder mes disponibilités"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
// State pour calendrier de disponibilités (ami du vert)
// Formulaire pour ajouter une plage horaire à une date
function PlageHoraireForm({ onAdd }) {
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  return (
    <form className="flex items-center gap-2 mt-2" onSubmit={e => {
      e.preventDefault();
      if (heureDebut && heureFin && heureDebut < heureFin) {
        onAdd(heureDebut, heureFin);
        setHeureDebut("");
        setHeureFin("");
      }
    }}>
      <input type="time" value={heureDebut} onChange={e => setHeureDebut(e.target.value)} className="border rounded px-2 py-1" required />
      <span>-</span>
      <input type="time" value={heureFin} onChange={e => setHeureFin(e.target.value)} className="border rounded px-2 py-1" required />
      <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded text-xs">Ajouter</button>
    </form>
  );
}
// (déjà déplacé en haut du composant)
}

export default ProfilePage;