'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Simule les données locales des jardiniers
const jardiniers = [
  {
    id: 1,
    prénom: "Alice",
    nom: "Dupont",
    description: "Jardinage urbain avec des plantes locales.",
    photos: ["/assets/jardinier1.jpg", "/assets/jardinier2.jpg", "/assets/jardinier3.jpg", "/assets/jardinier4.jpg"],
    localisation: "15 Rue des Champs, 75012 Paris",
    services: "Jardinage écologique, création de potagers urbains",
    expériences: "5 ans d'expérience"
  },
  {
    id: 2,
    prénom: "Jean",
    nom: "Martin",
    description: "Jardinier passionné par les plantes exotiques.",
    photos: ["/assets/jardinier1.jpg", "/assets/jardinier2.jpg", "/assets/jardinier3.jpg", "/assets/jardinier4.jpg"],
    localisation: "45 Avenue de la République, 75011 Paris",
    services: "Plantes exotiques, aménagement paysager",
    expériences: "8 ans d'expérience"
  },
  {
    id: 3,
    prénom: "Clara",
    nom: "Lemoine",
    description: "Aménagement de jardins verts et durables.",
    photos: ["/assets/jardinier1.jpg", "/assets/jardinier2.jpg", "/assets/jardinier3.jpg", "/assets/jardinier4.jpg"],
    localisation: "23 Rue de la Nature, 75005 Paris",
    services: "Jardinage durable, permaculture",
    expériences: "3 ans d'expérience"
  },
  {
    id: 4,
    prénom: "Pierre",
    nom: "Tardieu",
    description: "Création de jardins zen et méditatifs.",
    photos: ["/assets/jardinier1.jpg", "/assets/jardinier2.jpg", "/assets/jardinier3.jpg", "/assets/jardinier4.jpg"],
    localisation: "78 Boulevard Saint-Germain, 75006 Paris",
    services: "Jardins zen, conception paysagère",
    expériences: "10 ans d'expérience"
  },
  {
    id: 5,
    prénom: "Sophie",
    nom: "Dubois",
    description: "Spécialiste en entretien de jardins et plantations.",
    photos: ["/assets/jardinier1.jpg", "/assets/jardinier2.jpg", "/assets/jardinier3.jpg", "/assets/jardinier4.jpg"],
    localisation: "12 Rue de l'Écologie, 75009 Paris",
    services: "Entretien de jardins, plantations, taille d'arbres",
    expériences: "7 ans d'expérience"
  },
  {
    id: 6,
    prénom: "Marc",
    nom: "Lemoine",
    description: "Jardinage et aménagement de jardins de fleurs.",
    photos: ["/assets/jardinier1.jpg", "/assets/jardinier2.jpg", "/assets/jardinier3.jpg", "/assets/jardinier4.jpg"],
    localisation: "56 Rue du Bois, 75014 Paris",
    services: "Création de jardins fleuris, aménagement extérieur",
    expériences: "4 ans d'expérience"
  },
  {
    id: 7,
    prénom: "Julie",
    nom: "Lemoine",
    description: "Conception de jardins pour bien-être et relaxation.",
    photos: ["/assets/jardinier1.jpg", "/assets/jardinier2.jpg", "/assets/jardinier3.jpg", "/assets/jardinier4.jpg"],
    localisation: "30 Rue de la Paix, 75008 Paris",
    services: "Jardinage zen, plantes médicinales",
    expériences: "6 ans d'expérience"
  },
  {
    id: 8,
    prénom: "David",
    nom: "Frémont",
    description: "Spécialiste en potagers urbains et jardins communautaires.",
    photos: ["/assets/jardinier1.jpg", "/assets/jardinier2.jpg", "/assets/jardinier3.jpg", "/assets/jardinier4.jpg"],
    localisation: "120 Avenue de la Liberté, 75013 Paris",
    services: "Potagers urbains, jardins communautaires",
    expériences: "2 ans d'expérience"
  }
]

export default function JardinierPage() {
  const { id } = useParams()
  const [jardinier, setJardinier] = useState(null)
  const [mainPhoto, setMainPhoto] = useState(null)

  useEffect(() => {
    const jardinierTrouve = jardiniers.find(j => j.id === parseInt(id))
    setJardinier(jardinierTrouve)
    if (jardinierTrouve && jardinierTrouve.photos?.length > 0) {
      setMainPhoto(jardinierTrouve.photos[0])
    }
  }, [id])

  if (!jardinier) {
    return <p className="p-6 text-center">Jardinier introuvable</p>
  }

  return (
    <div className="min-h-screen p-6 bg-white">
      {/* Nom + Actions */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <h1 className="text-2xl font-bold text-green-800">{jardinier.prénom} {jardinier.nom}</h1>
        <div className="flex gap-3 text-sm">
          <span className="text-gray-600">Jardinier</span>
          <button>Partager</button>
          <button>♥</button>
        </div>
      </div>
      
      {/* Photos & infos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Image principale */}
        <div className="lg:col-span-2">
          <img src={mainPhoto} className="rounded-lg w-full h-64 object-cover" />
        </div>

        {/* Infos du jardiner */}
        <div className="bg-gray-100 p-4 rounded-xl text-sm">
          <h3 className="font-bold mb-2 text-green-800">Informations du Jardinier</h3>
          <p className="font-bold mb-2 text-green-800">Nom : {jardinier.prénom} {jardinier.nom}</p>
          <p className="font-bold mb-2 text-green-800">Statut vérifié</p>
          <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded">Message</button>
        </div>
      </div>

      {/* Informations sur le jardinier */}
      <div className="mb-6">
        <h2 className="font-bold text-lg mb-2 text-green-800">Description</h2>
        <p className="text-sm text-green-800">{jardinier.description}</p>
        <p className="text-sm text-green-800">Localisation : {jardinier.localisation}</p>
        <p className="text-sm text-green-800">Services : {jardinier.services}</p>
        <p className="text-sm text-green-800">Expériences : {jardinier.expériences}</p>
      </div>

      {/* Galerie de photos */}
      <div className="mb-6">
        <img
          src={mainPhoto}
          alt="Photo principale"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        {jardinier.photos?.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {jardinier.photos.slice(1).map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Miniature ${idx + 1}`}
                className="h-24 w-full object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => setMainPhoto(photo)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Commentaires */}
      <div>
        <h2 className="font-bold text-lg mb-2 text-green-800">Commentaires</h2>
        <div className="bg-gray-100 p-4 rounded-xl text-sm">
          (📝 Zone de commentaires à venir)
        </div>
      </div>
    </div>
  )
}
