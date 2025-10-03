"use client";

import { useEffect, useState } from "react";

export default function ModifierJardinPage({ searchParams }) {
  const id = searchParams?.id; // ex: /modifier-jardin?id=2
  const [jardin, setJardin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    adresse: "",
    superficie: "",
    type: "",
    besoins: "",
  });
  const [anciennesPhotos, setAnciennesPhotos] = useState([]);
  const [nouvellesPhotos, setNouvellesPhotos] = useState([]);

  // Charger les infos du jardin
  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jardins/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setJardin(data);
        setForm({
          titre: data.titre,
          description: data.description,
          adresse: data.adresse,
          superficie: data.superficie,
          type: data.type,
          besoins: data.besoins,
        });
        setAnciennesPhotos(JSON.parse(data.photos || "[]"));
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Erreur chargement jardin :", err);
        setLoading(false);
      });
  }, [id]);

  // Gérer changement des champs texte
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Gérer ajout de nouvelles photos
  const handleFileChange = (e) => {
    setNouvellesPhotos([...e.target.files]);
  };

  // Envoyer mise à jour
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    const formData = new FormData();
    formData.append("titre", form.titre);
    formData.append("description", form.description);
    formData.append("adresse", form.adresse);
    formData.append("superficie", form.superficie);
    formData.append("type", form.type);
    formData.append("besoins", form.besoins);

    anciennesPhotos.forEach((p) => formData.append("anciennesPhotos", p));
    nouvellesPhotos.forEach((photo) => formData.append("photos", photo));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jardins/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Erreur modification jardin");

      alert("✅ Jardin modifié avec succès !");
    } catch (err) {
      console.error("❌ Erreur :", err);
      alert("Erreur lors de la modification du jardin");
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ Chargement...</p>;

  return (
    <div className="min-h-screen px-[10%] py-24 bg-white">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Modifier mon jardin
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <input
          type="text"
          name="titre"
          value={form.titre}
          onChange={handleChange}
          placeholder="Titre du jardin"
          className="w-full border rounded p-2"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          name="adresse"
          value={form.adresse}
          onChange={handleChange}
          placeholder="Adresse"
          className="w-full border rounded p-2"
          required
        />
        <input
          type="number"
          name="superficie"
          value={form.superficie}
          onChange={handleChange}
          placeholder="Superficie (m²)"
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Type de jardin"
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          name="besoins"
          value={form.besoins}
          onChange={handleChange}
          placeholder="Besoins"
          className="w-full border rounded p-2"
          required
        />

        {/* Anciennes photos */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-2">Photos existantes</h2>
          <div className="flex gap-4 flex-wrap">
            {anciennesPhotos.length > 0 ? (
              anciennesPhotos.map((p, idx) => (
                <img
                  key={idx}
                  src={p}
                  alt={`photo-${idx}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))
            ) : (
              <p className="text-gray-500">Aucune photo</p>
            )}
          </div>
        </div>

        {/* Nouvelles photos */}
        <div>
          <label className="block font-semibold text-gray-700">
            Ajouter de nouvelles photos
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-[#e3107d] text-white px-6 py-2 rounded-lg hover:bg-pink-800 transition"
        >
          Modifier mon jardin
        </button>
      </form>
    </div>
  );
}
