'use client'

export default function CommentaireBloc() {
  const commentaires = [
    {
      nom: 'Marie Dupont',
      texte: 'Très bon contact, super jardinier ! 🌿',
    },
    {
      nom: 'Jean Martin',
      texte: 'Ponctuel et efficace, je recommande.',
    },
    {
      nom: 'Claire Leroy',
      texte: 'Excellent travail, je ferai à nouveau appel à lui.',
    },
    {
      nom: 'Samuel Roux',
      texte: 'Professionnel et sympathique, merci !',
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-green-700 mb-4">Commentaires</h2>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {commentaires.map((commentaire, index) => (
          <div
            key={index}
            className="min-w-[250px] max-w-[300px] bg-white border border-gray-200 rounded-lg shadow p-4 flex-shrink-0"
          >
            <h3 className="font-semibold text-gray-800">{commentaire.nom}</h3>
            <p className="text-sm text-gray-600 mt-2">{commentaire.texte}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
