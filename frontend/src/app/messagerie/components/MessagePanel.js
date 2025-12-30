import React, { useRef, useEffect } from "react";

export default function MessagePanel({ messages, onSend, userId }) {
  const inputRef = useRef();
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    const text = inputRef.current.value.trim();
    if (text) {
      onSend(text);
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-green-50">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-10">Aucun message</div>
        )}
        {messages.map((msg, idx) => {
          const isMe = msg.from === userId;
          return (
            <div key={idx} className={`mb-2 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              {/* Message reçu : avatar à gauche */}
              {!isMe && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-2 overflow-hidden">
                  {msg.photo ? (
                    <img src={msg.photo} alt={msg.nom || '?'} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-base font-bold text-green-700">{msg.nom?.[0] || '?'}</span>
                  )}
                </div>
              )}
              <div className="flex flex-col max-w-xs">
                {/* Date/heure au-dessus du message */}
                <div className="text-xs text-gray-400 mb-1 text-left pl-1">
                  {msg.date && new Date(msg.date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isMe
                      ? 'bg-green-400 text-white self-end'
                      : 'bg-white border self-start'
                  }`}
                >
                  <div className="text-sm break-words">{msg.text}</div>
                </div>
              </div>
              {/* Message envoyé : avatar à droite */}
              {isMe && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-200 flex items-center justify-center ml-2 overflow-hidden">
                  {msg.photo ? (
                    <img src={msg.photo} alt={msg.nom || '?'} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-base font-bold text-green-700">{msg.nom?.[0] || '?'}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex p-2 border-t bg-white">
        <input
          ref={inputRef}
          type="text"
          placeholder="Saisissez un message"
          className="flex-1 px-3 py-2 rounded-l border focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[#e3107d] hover:bg-pink-700 text-white px-4 py-2 rounded-r flex items-center justify-center"
          aria-label="Envoyer"
        >
          {/* Flèche droite unicode */}
          <span className="text-xl">&#8594;</span>
        </button>
      </form>
    </div>
  );
}
