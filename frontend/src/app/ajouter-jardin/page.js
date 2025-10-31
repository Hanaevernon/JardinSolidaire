"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AjouterJardin() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    adresse: "",
    superficie: "",
    type: "",
    besoins: "",
    region: "",
  });
  const [photos, setPhotos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      alert("⚠️ Maximum 5 photos autorisées.");
      return;
    }
    setPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("⚠️ Vous devez être connecté pour ajouter un jardin.");
      return;
    }

    try {
      const data = new FormData();
      data.append("id_proprietaire", user.id_utilisateur);
      data.append("titre", formData.titre);
      data.append("description", formData.description);
      data.append("adresse", formData.adresse);
      data.append("superficie", formData.superficie);

  data.append("type", formData.type);
  data.append("besoins", formData.besoins);
  data.append("region", formData.region);

      photos.forEach((file) => {
        data.append("photos", file);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jardins`, {
        method: "POST",
        body: data, // ✅ envoi FormData
      });

      if (res.ok) {
        alert("👏 Jardin ajouté avec succès !");
        router.push("/jardins");
      } else {
        const err = await res.json();
        console.error("❌ Erreur API :", err);
        alert("❌ Erreur lors de l'ajout du jardin");
      }
    } catch (err) {
      console.error("❌ Erreur réseau :", err);
      alert("❌ Impossible de contacter le serveur");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">
        Ajouter un Jardin 🌿
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto"
      >
        {/* 📸 Upload des photos */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photos (max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="mt-2 w-full border rounded px-3 py-2 text-gray-700"
          />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-opacity-80 transition"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Champs texte */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom de l&apos;annonce :
            </label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description :
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adresse :
            </label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Superficie (m²) :
            </label>
            <input
              type="number"
              name="superficie"
              value={formData.superficie}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type de jardin :
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Région :
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
              required
            >
              <option value="">Sélectionner une région</option>
              <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
              <option value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</option>
              <option value="Bretagne">Bretagne</option>
              <option value="Centre-Val de Loire">Centre-Val de Loire</option>
              <option value="Corse">Corse</option>
              <option value="Grand Est">Grand Est</option>
              <option value="Hauts-de-France">Hauts-de-France</option>
              <option value="Île-de-France">Île-de-France</option>
              <option value="Normandie">Normandie</option>
              <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
              <option value="Occitanie">Occitanie</option>
              <option value="Pays de la Loire">Pays de la Loire</option>
              <option value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</option>
              <option value="Guadeloupe">Guadeloupe</option>
              <option value="Martinique">Martinique</option>
              <option value="Guyane">Guyane</option>
              <option value="La Réunion">La Réunion</option>
              <option value="Mayotte">Mayotte</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Besoins :
            </label>
            <input
              type="text"
              name="besoins"
              value={formData.besoins}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
            />
          </div>

          {/* Bouton rose comme avant */}
          <button
            type="submit"
            className="bg-[#E3107D] hover:bg-[#c30c6a] text-white px-6 py-2 rounded-full mt-4"
          >
            Ajouter mon jardin
          </button>
        </div>
      </form>
    </div>
  );
}
