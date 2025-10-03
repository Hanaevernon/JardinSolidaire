"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { removePhotoFromArray } from "@/utils/removePhoto";

export default function JeVeuxJardinerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    localisation: "",
    disponibilites: "",
    competences: "",
    photos: [],
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const total = formData.photos.length + newFiles.length;

    if (total > 5) {
      setMessage("⚠️ Tu ne peux ajouter que 5 photos maximum.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newFiles],
    }));
  };

  const removePhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      photos: removePhotoFromArray(prev.photos, indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      setMessage("⚠️ Tu dois être connecté pour publier ton annonce.");
      return;
    }

    const data = {
      id_utilisateur: Number(currentUser.id_utilisateur),
      titre: formData.titre,
      description: formData.description,
      localisation: formData.localisation,
      disponibilites: formData.disponibilites,
      competences: formData.competences,
      photos: formData.photos.map((f) => f.name), // ⚠️ à remplacer par upload réel
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jardiniers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage("✅ Annonce publiée avec succès !");
        setTimeout(() => router.push("/jardiniers"), 1500);
      } else {
        const err = await res.json();
        setMessage(err.error || "❌ Erreur lors de la publication.");
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
      setMessage("❌ Erreur réseau. Réessaye plus tard.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Je veux jardiner 🌱
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white shadow-lg rounded-xl p-6"
      >
        {/* Photos */}
        <div className="flex flex-col items-center">
          <label className="block w-full text-sm font-medium text-green-800 mb-2">
            Photos (max 5) :
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full border-2 border-green-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-green-500"
          />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {formData.photos.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg shadow"
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

        {/* Infos */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-800">
              Titre de l’annonce :
            </label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              className="mt-1 w-full border-2 border-green-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800">
              Description :
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full border-2 border-green-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800">
              Localisation :
            </label>
            <input
              type="text"
              name="localisation"
              value={formData.localisation}
              onChange={handleChange}
              className="mt-1 w-full border-2 border-green-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800">
              Disponibilités :
            </label>
            <input
              type="text"
              name="disponibilites"
              value={formData.disponibilites}
              onChange={handleChange}
              placeholder="Ex: soirs et week-ends"
              className="mt-1 w-full border-2 border-green-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800">
              Compétences (tonte, plantation...) :
            </label>
            <input
              type="text"
              name="competences"
              value={formData.competences}
              onChange={handleChange}
              className="mt-1 w-full border-2 border-green-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full mt-6 shadow-lg"
          >
            Publier mon annonce
          </button>

          {message && (
            <p
              className={`mt-3 text-sm font-medium ${
                message.startsWith("✅")
                  ? "text-green-700"
                  : message.startsWith("⚠️")
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
