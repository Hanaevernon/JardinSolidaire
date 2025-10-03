'use client'

export default function ProfilPhoto({ photoUrl, nom }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <img
        src={photoUrl}
        alt={`Photo de ${nom}`}
        className="w-20 h-20 rounded-full object-cover border-4 border-green-300 shadow"
      />
      <div>
        <p className="text-xl font-semibold text-green-800">{nom}</p>
        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Jardinier</span>
      </div>
    </div>
  );
}
