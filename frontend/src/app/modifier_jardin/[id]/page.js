"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function ModifierJardinPage() {
  const { id } = useParams(); // ex: /modifier_jardin/[id]
  const [jardin, setJardin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    adresse: "",
    superficie: "",
    type: "",
    besoins: "",
    region: "",
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
          titre: data.titre || "",
          description: data.description || "",
          adresse: data.adresse || "",
          superficie: data.superficie ? String(data.superficie) : "",
          type: data.type || "",
          besoins: data.besoins || "",
          region: data.region || "",
        });
        // Gestion robuste des photos (tableau, JSON ou string)
        let photos = [];
        if (Array.isArray(data.photos)) {
          photos = data.photos;
        } else if (typeof data.photos === "string" && data.photos.length > 0) {
          try {
            photos = JSON.parse(data.photos);
            if (!Array.isArray(photos)) photos = [data.photos];
          } catch {
            photos = [data.photos];
          }
        }
        setAnciennesPhotos(photos);
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

  const router = useRouter();
  // Envoyer mise à jour
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    const formData = new FormData();
    formData.append("titre", form.titre);
    formData.append("description", form.description);
    formData.append("adresse", form.adresse);
  if (form.superficie) formData.append("superficie", form.superficie);
  if (form.type) formData.append("type", form.type);
  if (form.besoins) formData.append("besoins", form.besoins);
  if (form.region) formData.append("region", form.region);

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
      router.push("/profile");
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

        <select
          name="region"
          value={form.region}
          onChange={handleChange}
          className="w-full border rounded p-2"
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
          <option value="Provence-Alpes-Côte d&apos;Azur">Provence-Alpes-Côte d&apos;Azur</option>
          <option value="Guadeloupe">Guadeloupe</option>
          <option value="Martinique">Martinique</option>
          <option value="Guyane">Guyane</option>
          <option value="La Réunion">La Réunion</option>
          <option value="Mayotte">Mayotte</option>
        </select>
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
              anciennesPhotos.map((p, idx) => {
                let src = p;
                // Si le chemin ne commence pas par http ou /uploads, on le préfixe
                if (typeof p === "string" && !p.startsWith("http") && !p.startsWith("/uploads")) {
                  src = `http://localhost:5001/uploads/${p}`;
                } else if (typeof p === "string" && p.startsWith("/uploads")) {
                  src = `http://localhost:5001${p}`;
                }
                return (
                  <img
                    key={idx}
                    src={src}
                    alt={`photo-${idx}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                );
              })
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
