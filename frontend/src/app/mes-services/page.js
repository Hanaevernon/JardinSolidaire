"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools,
  faUser,
  faCheck,
  faTimes,
  faInfoCircle,
  faEye,
  faPlus,
  faClock,
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faStar,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

const MesServicesPage = () => {
  const [user, setUser] = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Vérifier que c'est bien un jardinier
      if (userData.role !== "ami_du_vert") {
        window.location.href = "/";
        return;
      }
      
      fetchCompetences(userData.id_utilisateur);
      fetchDemandesServices(userData.id_utilisateur);
    } else {
      window.location.href = "/connexion";
    }
  }, []);

  const fetchCompetences = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/utilisateur/${userId}/competences`
      );
      const data = await response.json();
      setCompetences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur lors du chargement des compétences:", error);
    }
  };

  const fetchDemandesServices = async (userId) => {
    try {
      // Pour l'instant, on simule les demandes de services reçues
      // Dans une vraie application, il faudrait créer une table "services" et "demandes_services"
      setDemandes([]);
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDemandeStatus = async (demandeId, newStatus) => {
    setUpdating(demandeId);
    try {
      // Logique pour mettre à jour le statut d'une demande de service
      console.log("Mise à jour du statut:", demandeId, newStatus);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos services...</p>
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
              Mes services de jardinage
            </h1>
            <p className="text-gray-600">
              Gérez vos compétences et les demandes de services reçues
            </p>
          </div>
          <Link href="/profile/edit">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center">
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Modifier mes compétences
            </button>
          </Link>
        </div>

        {/* Section Mes Compétences */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FontAwesomeIcon icon={faTools} className="text-green-600 mr-2" />
            Mes compétences en jardinage
          </h2>
          
          {competences.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {competences.map((competence, index) => (
                  <div
                    key={index}
                    className="bg-green-50 rounded-lg p-4 border border-green-200"
                  >
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faStar} className="text-green-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">{competence.nom_competence}</h3>
                    </div>
                    {competence.description && (
                      <p className="text-sm text-gray-600">{competence.description}</p>
                    )}
                    <div className="mt-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Niveau : {competence.niveau || "Débutant"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-800">Proposez vos services !</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Avec vos compétences en jardinage, vous pouvez proposer vos services aux propriétaires 
                  qui ont besoin d&apos;aide pour entretenir leurs jardins. Les demandes apparaîtront ci-dessous.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FontAwesomeIcon icon={faTools} className="text-gray-300 text-4xl mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Aucune compétence renseignée
              </h3>
              <p className="text-gray-500 mb-4">
                Ajoutez vos compétences en jardinage pour proposer vos services aux propriétaires.
              </p>
              <Link href="/profile/edit">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Ajouter mes compétences
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Section Demandes de Services Reçues */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 mr-2" />
            Demandes de services reçues
          </h2>

          {/* Pour l'instant, on affiche un message indiquant que cette fonctionnalité sera disponible */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FontAwesomeIcon icon={faTools} className="text-gray-300 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Fonctionnalité en cours de développement
            </h3>
            <p className="text-gray-500 mb-6">
              Les propriétaires pourront bientôt vous contacter directement pour demander vos services de jardinage. 
              Cette section affichera toutes les demandes que vous recevrez.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faInfoCircle} className="text-yellow-600 mr-2" />
                <h4 className="font-semibold text-yellow-800">Prochaines fonctionnalités :</h4>
              </div>
              <ul className="text-sm text-yellow-700 text-left space-y-1">
                <li>• Réception de demandes de services</li>
                <li>• Acceptation/refus des demandes</li>
                <li>• Chat avec les propriétaires</li>
                <li>• Planification des interventions</li>
                <li>• Système de notation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section Statistiques (simulées) */}
        {competences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Vos statistiques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <FontAwesomeIcon icon={faCheck} className="text-green-600 text-2xl mb-2" />
                <h3 className="text-2xl font-bold text-gray-800">0</h3>
                <p className="text-gray-600">Services réalisés</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <FontAwesomeIcon icon={faStar} className="text-yellow-600 text-2xl mb-2" />
                <h3 className="text-2xl font-bold text-gray-800">-</h3>
                <p className="text-gray-600">Note moyenne</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <FontAwesomeIcon icon={faUser} className="text-blue-600 text-2xl mb-2" />
                <h3 className="text-2xl font-bold text-gray-800">{competences.length}</h3>
                <p className="text-gray-600">Compétences</p>
              </div>
            </div>
          </div>
        )}

        {/* Section Conseils */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 mr-2" />
            Conseils pour proposer vos services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Complétez votre profil</h4>
              <p className="text-sm text-gray-600">
                Ajoutez une photo, une biographie détaillée et toutes vos compétences 
                pour inspirer confiance aux propriétaires.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Soyez réactif</h4>
              <p className="text-sm text-gray-600">
                Répondez rapidement aux demandes de services pour augmenter 
                vos chances d&apos;être sélectionné.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Qualité du travail</h4>
              <p className="text-sm text-gray-600">
                Fournissez un travail de qualité pour obtenir de bonnes évaluations 
                et fidéliser vos clients.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Communication</h4>
              <p className="text-sm text-gray-600">
                Maintenez une bonne communication avec les propriétaires 
                avant, pendant et après les interventions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesServicesPage;