'use client'
import React, { useState} from "react"
import Link from "next/link";

// Données locales ici directement
const jardiniers = [
    {
      id: 1,
      prénom: "Alice",
      nom: "Dupont",
      description: "Jardinage urbain avec des plantes locales.",
      photoUrl: "/assets/jardinier1.jpg",
      localisation: "15 Rue des Champs, 75012 Paris",
      services: "Jardinage écologique, création de potagers urbains",
      expériences: "5 ans d'expérience"
    },
    {
      id: 2,
      prénom: "Jean",
      nom: "Martin",
      description: "Jardinier passionné par les plantes exotiques.",
      photoUrl: "/assets/jardinier2.jpg",
      localisation: "45 Avenue de la République, 75011 Paris",
      services: "Plantes exotiques, aménagement paysager",
      expériences: "8 ans d'expérience"
    },
    {
      id: 3,
      prénom: "Clara",
      nom: "Lemoine",
      description: "Aménagement de jardins verts et durables.",
      photoUrl: "/assets/jardinier3.jpg",
      localisation: "23 Rue de la Nature, 75005 Paris",
      services: "Jardinage durable, permaculture",
      expériences: "3 ans d'expérience"
    },
    {
      id: 4,
      prénom: "Pierre",
      nom: "Tardieu",
      description: "Création de jardins zen et méditatifs.",
      photoUrl: "/assets/jardinier4.jpg",
      localisation: "78 Boulevard Saint-Germain, 75006 Paris",
      services: "Jardins zen, conception paysagère",
      expériences: "10 ans d'expérience"
    },
    {
      id: 5,
      prénom: "Sophie",
      nom: "Dubois",
      description: "Spécialiste en entretien de jardins et plantations.",
      photoUrl: "/assets/jardinier5.jpg",
      localisation: "12 Rue de l'Écologie, 75009 Paris",
      services: "Entretien de jardins, plantations, taille d'arbres",
      expériences: "7 ans d'expérience"
    },
    {
      id: 6,
      prénom: "Marc",
      nom: "Lemoine",
      description: "Jardinage et aménagement de jardins de fleurs.",
      photoUrl: "/assets/jardinier6.jpg",
      localisation: "56 Rue du Bois, 75014 Paris",
      services: "Création de jardins fleuris, aménagement extérieur",
      expériences: "4 ans d'expérience"
    },
    {
      id: 7,
      prénom: "Julie",
      nom: "Lemoine",
      description: "Conception de jardins pour bien-être et relaxation.",
      photoUrl: "/assets/jardinier7.jpg",
      localisation: "30 Rue de la Paix, 75008 Paris",
      services: "Jardinage zen, plantes médicinales",
      expériences: "6 ans d'expérience"
    },
    {
      id: 8,
      prénom: "David",
      nom: "Frémont",
      description: "Spécialiste en potagers urbains et jardins communautaires.",
      photoUrl: "/assets/jardinier8.jpg",
      localisation: "120 Avenue de la Liberté, 75013 Paris",
      services: "Potagers urbains, jardins communautaires",
      expériences: "2 ans d'expérience"
    }
]

const ListeJardiniers = () => {
    const [favoris, setFavoris] = useState([])
    const [search, setSearch] = useState('')
    const [quartier, setQuartier] = useState ('')
    const [type, setType] = useState ('')

    const toggleFavori = (id) => {
        setFavoris((prev) => 
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [ ...prev, id]
        )
    }

    return (
        <div className="min-h-screen px-6 py-10 bg-white">
            <h1 className="text-3xl font-bold mb-8 text-center text-green-800">Nos Jardiniers Solidaires</h1>

            <div className="mb-8 flex flex-col lg:flex-row items-center gap-4 flex-wrap">

                {/* Barre de recherche stylisée */}
                <div className="relative w-full lg:w-[30%]">
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Rechercher un jardinier..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2  text-sm text-gray-700"
                    />
                </div>

                {/* Sélecteur quartier */}
                <select
                    value={quartier}
                    onChange={(e) => setQuartier(e.target.value)}
                    className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2  w-full lg:w-[20%] text-sm text-gray-700"
                >
                    <option value="">Tous les quartiers</option>
                    <option value="centre">Centre-ville</option>
                    <option value="nord">Quartier Nord</option>
                    <option value="sud">Quartier Sud</option>
                </select>

                {/* Sélecteur type */}
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2  w-full lg:w-[20%] text-sm text-gray-700"
                >
                    <option value="">Tous les types de services</option>
                    <option value="jardinage écologique">Jardinage écologique</option>
                    <option value="aménagement paysager">Aménagement paysager</option>
                    <option value="permaculture">Permaculture</option>
                    <option value="plantes exotiques">Plantes exotiques</option>
                </select>

                {/* Bouton réinitialiser */}
                <button
                    onClick={() => {
                        setSearch('')
                        setQuartier('')
                        setType('')
                    }}
                    className="px-5 py-2 rounded-full bg-[#E3107D] hover:bg-[#c30c6a] text-white transition w-full lg:w-auto"
                >
                    Réinitialiser
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {jardiniers
                    .filter((jardinier) => 
                        jardinier.nom.toLowerCase().includes(search.toLowerCase()) &&
                        (quartier === '' || jardinier.localisation.includes(quartier)) &&
                        (type === '' || jardinier.services.toLowerCase().includes(type.toLowerCase()))
                    )
                    .map((jardinier) => (
                        <Link
                            key={jardinier.id}
                            href={`/jardiniers/${jardinier.id}`}
                            className="block"
                        >
                            <div className="bg-green-100 rounded-2xl overflow-hidden shadow-md relative group hover:shadow-xl transition">
                                {/* Image */}
                                <img
                                    src={jardinier.photoUrl}
                                    alt={jardinier.nom}
                                    className="h-48 w-full object-cover"
                                />

                                {/* Texte */}
                                <div className="px-3 py-2 text-sm text-gray-700">
                                    {/* Titre + cœur */}
                                    <div className="flex justify-between items-start mb-1">
                                        <h2 className="font-bold text-base text-green-900">{jardinier.prénom} {jardinier.nom}</h2>
                                        <button
                                            onClick={() => toggleFavori(jardinier.id)}
                                            className="text-xl transition-transform transform hover:scale-125"
                                        >
                                            {favoris.includes(jardinier.id) ? (
                                                <span className="text-pink-500">♥</span>
                                            ) : (
                                                <span className="text-gray-400">♡</span>
                                            )}
                                        </button>
                                    </div>

                                    {/* Infos supplémentaires */}
                                    <p className="text-xs leading-tight">{jardinier.description}</p>
                                    <p className="text-xs leading-tight">{jardinier.localisation}</p>
                                    <p className="text-xs leading-tight">{jardinier.services}</p>
                                    <p className="text-xs leading-tight">{jardinier.expériences}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    )
}

export default ListeJardiniers
