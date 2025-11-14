import React, { useState } from "react";

export default function ConversationList({ conversations, onSelect, selectedId, onDelete }) {
  const [search, setSearch] = useState("");
  const filtered = conversations.filter(c =>
    c.nom?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="w-full h-full overflow-y-auto bg-white">
      <div className="p-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une discussion..."
          className="w-full px-3 py-2 border rounded focus:outline-none"
        />
      </div>
      <ul>
        {filtered.length === 0 && (
          <li className="p-4 text-gray-500">Aucune conversation</li>
        )}
        {filtered.map((conv) => (
          <li
            key={conv.id}
            className={`flex items-center px-4 py-3 border-b cursor-pointer transition-colors ${selectedId === conv.id ? "bg-green-100" : "hover:bg-green-50"}`}
            onClick={() => onSelect(conv.id)}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center overflow-hidden mr-3">
              {conv.photo ? (
                <img src={conv.photo} alt={conv.nom} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-green-700">{conv.nom?.[0] || "?"}</span>
              )}
            </div>
            {/* Infos */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold truncate">{conv.nom}</span>
                {/* Heure du dernier message */}
                {conv.lastDate && (
                  <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                    {new Date(conv.lastDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {conv.lastMessage}
              </div>
            </div>
            {/* Badge non lu (exemple, à adapter si tu as l'info) */}
            {/* <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5">1</span> */}
            {onDelete && (
              <button
                className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 border border-red-200"
                onClick={e => { e.stopPropagation(); onDelete(conv.id); }}
                title="Supprimer la conversation"
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
