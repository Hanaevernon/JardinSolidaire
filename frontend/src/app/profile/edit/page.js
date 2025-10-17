"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faArrowLeft,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

const EditProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    biographie: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/utilisateur/${userId}`
      );
      const userData = await response.json();
      
      setFormData({
        prenom: userData.prenom || "",
        nom: userData.nom || "",
        email: userData.email || "",
        telephone: userData.telephone || "",
        adresse: userData.adresse || "",
        biographie: userData.biographie || "",
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/utilisateur/${user.id_utilisateur}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setMessage("Profil mis à jour avec succès !");
        // Mettre à jour les données utilisateur dans le localStorage si nécessaire
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        setTimeout(() => {
          window.location.href = "/profile";
        }, 2000);
      } else {
        setMessage("Erreur lors de la mise à jour du profil.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Erreur lors de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex items-center mb-6">
          <Link href="/profile" className="mr-4">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Retour
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Modifier le profil</h1>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes("succès") 
                ? "bg-green-100 text-green-800 border border-green-200" 
                : "bg-red-100 text-red-800 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prénom */}
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
                  Prénom
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                  required
                />
              </div>

              {/* Nom */}
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
                  Nom
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-green-600" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                required
              />
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-600" />
                Téléphone
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
              />
            </div>

            {/* Adresse */}
            <div>
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-green-600" />
                Adresse
              </label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
              />
            </div>

            {/* Biographie */}
            <div>
              <label htmlFor="biographie" className="block text-sm font-medium text-gray-700 mb-2">
                Biographie
              </label>
              <textarea
                id="biographie"
                name="biographie"
                value={formData.biographie}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                placeholder="Parlez-nous de vous, vos expériences en jardinage..."
              />
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link href="/profile">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;