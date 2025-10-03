'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function BlocCompetencePresentation({ jardinierId }) {
  const [jardinier, setJardinier] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`/api/jardiniers/${jardinierId}`)
        setJardinier(res.data)
      } catch (error) {
        console.error('Erreur chargement jardinier :', error)
      }
    }
    if (jardinierId) fetchData()
  }, [jardinierId])

  if (!jardinier) return <p>Chargement...</p>

  return (
    <div className="bg-green-50 p-4 rounded-lg shadow-sm w-full">
      <h2 className="text-xl font-semibold text-green-900 mb-2">Liste des compétences</h2>
      <ul className="list-disc list-inside text-green-800 mb-4">
        {jardinier.competences?.length > 0 ? (
          jardinier.competences.map((comp, i) => (
            <li key={i}>{comp.nom}</li>
          ))
        ) : (
          <li>Aucune compétence renseignée.</li>
        )}
      </ul>

      <h2 className="text-xl font-semibold text-green-900 mb-2">Informations du jardinier</h2>
      <p className="text-green-800 whitespace-pre-line">{jardinier.biographie || 'Non renseigné.'}</p>
    </div>
  )
}
