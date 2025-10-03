'use client'

import { useEffect, useState } from 'react'

export default function BoutonAvecConnexions({ onClick }) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsConnected(!!token)
  }, [])

  return (
    <div className="mt-6">
      <button
        onClick={isConnected ? onClick : null}
        className={`px-6 py-2 rounded-full font-semibold transition duration-200 ${
          isConnected
            ? 'bg-[#e3107d] text-white hover:bg-pink-700'
            : 'bg-gray-400 text-white cursor-not-allowed'
        }`}
      >
        Envoyer un message
      </button>

      {!isConnected && (
        <p className="text-sm text-gray-600 italic mt-2">
          Connecte-toi pour discuter avec ce jardinier 🌸
        </p>
      )}
    </div>
  )
}
