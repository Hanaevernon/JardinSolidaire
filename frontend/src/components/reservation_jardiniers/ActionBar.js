'use client'

import { useState, useEffect } from 'react'
import { Share2, Heart } from 'lucide-react'

export default function ActionBar() {
  const [liked, setLiked] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Vérifie la présence de l'utilisateur dans le localStorage
    const user = localStorage.getItem('utilisateur')
    setIsConnected(!!user)
  }, [])

  const handleLike = () => {
    if (!isConnected) {
      alert("Veuillez vous connecter pour ajouter ce jardinier en favori 🌱")
      return
    }

    setLiked(!liked)
    // Tu peux ajouter ici un fetch vers le backend pour sauvegarder l'action
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Découvrez ce jardinier',
        url: window.location.href,
      }).catch((err) => console.error('Erreur partage :', err))
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papiers !')
    }
  }

  return (
    <div className="flex items-center gap-6 mb-6">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 text-sm font-medium transition ${
          liked ? 'text-pink-600' : 'text-gray-600'
        }`}
      >
        <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
        {liked ? 'Aimé' : 'Aimer'}
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-700 transition"
      >
        <Share2 size={20} />
        Partager
      </button>
    </div>
  )
}
