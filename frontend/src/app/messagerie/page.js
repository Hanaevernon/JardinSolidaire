"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import ConversationList from "./components/ConversationList";
import MessagePanel from "./components/MessagePanel";



export default function MessageriePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConv, setLoadingConv] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [pendingContact, setPendingContact] = useState(null); // Pour stocker le nom du contact si conversation absente

  // Récupère les conversations de l'utilisateur connecté
  useEffect(() => {
    if (!user) return;
    setLoadingConv(true);
    console.log('[Messagerie] Chargement des conversations pour utilisateur', user.id_utilisateur);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/messagerie/conversations/${user.id_utilisateur}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('[Messagerie] Conversations reçues:', data);
        // Filtrer pour ne jamais afficher la conversation avec soi-même
        const filtered = Array.isArray(data)
          ? data.filter(c => String(c.id) !== String(user.id_utilisateur))
          : [];
        console.log('[Messagerie] Conversations filtrées:', filtered);
        setConversations(filtered);
        setLoadingConv(false);
      })
      .catch((err) => {
        console.error('[Messagerie] Erreur chargement conversations:', err);
        setConversations([]);
        setLoadingConv(false);
      });
  }, [user]);

  // Ouvre la discussion si paramètre 'to' dans l'URL
  useEffect(() => {
    const to = searchParams.get("to");
    const nom = searchParams.get("nom");
    console.log('[Messagerie] Paramètres URL:', { to, nom });
    if (to) {
      setSelectedId(to);
      // Si la conversation n'existe pas encore, on stocke le nom du contact
      if (nom) setPendingContact({ id: to, nom });
    }
  }, [searchParams]);

  // Récupère les messages de la conversation sélectionnée
  useEffect(() => {
    if (!selectedId) return setMessages([]);
    setLoadingMsg(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/messagerie/messages/${selectedId}?userId=${user?.id_utilisateur}`)
      .then((res) => res.json())
      .then((data) => {
        // Toujours un tableau, même si erreur
        setMessages(Array.isArray(data) ? data : []);
        setLoadingMsg(false);
      })
      .catch(() => {
        setMessages([]);
        setLoadingMsg(false);
      });
  }, [selectedId]);


  // Sélection d'une conversation
  const handleSelect = (id) => {
    console.log('[Messagerie] Sélection de la conversation avec id:', id);
    setSelectedId(id);
  };

  // Suppression d'une conversation côté frontend
  const handleDeleteConversation = async (id) => {
    if (!user) return;
    // Suppression côté backend
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messagerie/conversations/${user.id_utilisateur}/${id}`, {
        method: "DELETE"
      });
    } catch (e) {
      console.error("Erreur suppression conversation:", e);
    }
    // Suppression côté frontend
    setConversations((prev) => prev.filter((c) => String(c.id) !== String(id)));
    if (String(selectedId) === String(id)) {
      setSelectedId(null);
      setMessages([]);
    }
  };

  // Envoi d'un message
  const handleSend = async (text) => {
    if (!user || !selectedId) return;
    // On envoie le nom du destinataire si on ne le trouve pas dans la liste des conversations (nouveau contact)
    let nomContact = undefined;
    let conv = conversations.find(c => String(c.id) === String(selectedId));
    if (!conv && pendingContact && String(selectedId) === String(pendingContact.id)) {
      nomContact = pendingContact.nom;
    } else if (!conv && searchParams.get("nom")) {
      nomContact = searchParams.get("nom");
    }
    const message = {
      from: user.id_utilisateur,
      to: selectedId,
      text,
      ...(nomContact ? { nom: nomContact } : {})
    };
    console.log('[Messagerie] Envoi message:', message);
    // POST vers l'API
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messagerie/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    // Rafraîchir les messages
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/messagerie/messages/${selectedId}?userId=${user?.id_utilisateur}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
    // Attendre un court délai pour garantir la cohérence BDD
    setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/messagerie/conversations/${user.id_utilisateur}`)
        .then((res) => res.json())
        .then((data) => setConversations(Array.isArray(data) ? data : []));
    }, 300);
  };


  // Trouver la conversation sélectionnée pour l'affichage du nom et de la photo de l'interlocuteur
  let interlocuteurNom = "";
  let interlocuteurPhoto = null;
  const [jardinierInfo, setJardinierInfo] = useState(null);

  useEffect(() => {
    // On récupère le paramètre id_jardinier depuis l'URL
    const idJardinier = searchParams.get("id_jardinier");
    if (user && selectedId) {
      let conv = conversations.find(c => String(c.id) === String(selectedId));
      // Si id_jardinier est présent, on utilise ce paramètre pour récupérer le jardinier
      if (!conv && idJardinier && !isNaN(Number(idJardinier))) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/jardiniers/${idJardinier}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && data.id_jardinier) {
              setJardinierInfo({
                nom: ((data.prenom || '') + ' ' + (data.nom || '')).trim() || 'Jardinier',
                photo: data.photos && Array.isArray(data.photos) ? data.photos[0] : null
              });
            } else {
              setJardinierInfo(null);
            }
          })
          .catch(() => setJardinierInfo(null));
      } else if (!conv && !isNaN(Number(selectedId)) && String(selectedId) !== String(user.id_utilisateur)) {
        // Sinon, on tente comme avant
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/jardiniers/${selectedId}`)
          .then(res => {
            if (res.ok) return res.json();
            // Si le jardinier n'existe pas, on tente utilisateur
            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/utilisateur/${selectedId}`)
              .then(res2 => res2.ok ? res2.json() : null);
          })
          .then(data => {
            if (data && (data.id_jardinier || data.id_utilisateur)) {
              setJardinierInfo({
                nom: ((data.prenom || '') + ' ' + (data.nom || '')).trim() || 'Utilisateur',
                photo: data.photos && Array.isArray(data.photos) ? data.photos[0] : null
              });
            } else {
              setJardinierInfo(null);
            }
          })
          .catch(() => setJardinierInfo(null));
      } else {
        setJardinierInfo(null);
      }
    } else {
      setJardinierInfo(null);
    }
  }, [user, selectedId, conversations, searchParams]);

  if (user && selectedId) {
    let conv = conversations.find(c => String(c.id) === String(selectedId));
    if (pendingContact && String(selectedId) === String(pendingContact.id) && pendingContact.nom) {
      interlocuteurNom = pendingContact.nom;
    } else if (searchParams.get("nom")) {
      interlocuteurNom = searchParams.get("nom");
    } else if (conv && conv.nom) {
      interlocuteurNom = conv.nom;
      interlocuteurPhoto = conv.photo;
    } else if (jardinierInfo) {
      interlocuteurNom = jardinierInfo.nom;
      interlocuteurPhoto = jardinierInfo.photo;
    } else {
      interlocuteurNom = "Utilisateur";
    }
  }

  // Affichage principal :
  // - La liste des discussions s'affiche verticalement à gauche (sidebar)
  // - La conversation sélectionnée s'affiche à droite
  return (
  <div className="fixed inset-0 flex flex-col bg-white z-40">
      {/* Titre principal */}
      <div className="bg-white shadow flex items-center px-6 py-3 border-b">
        <h1 className="text-2xl font-bold flex-1">Ma messagerie</h1>
      </div>
      <div className="flex flex-1 min-h-0">
        {/* Si aucune discussion sélectionnée, la liste prend tout l'écran */}
        {!selectedId ? (
          <div className="w-full h-full bg-white overflow-y-auto">
            <div className="px-6 py-4 text-2xl font-bold text-green-900">Ma Messagerie</div>
            <ConversationList
              conversations={conversations}
              onSelect={handleSelect}
              selectedId={selectedId}
              onDelete={handleDeleteConversation}
            />
          </div>
        ) : (
          <>
            {/* Sidebar verticale pour la liste des discussions */}
            <div className="w-full sm:w-80 md:w-96 max-w-full h-full bg-green-50 overflow-y-auto">
              <div className="px-6 py-4 text-2xl font-bold text-green-900">Ma Messagerie</div>
              <ConversationList
                conversations={conversations}
                onSelect={handleSelect}
                selectedId={selectedId}
                onDelete={handleDeleteConversation}
              />
            </div>
            {/* Affichage de la conversation */}
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              <div className="px-6 py-3 border-b text-lg font-semibold text-green-900 flex items-center bg-white">
                {interlocuteurPhoto ? (
                  <img src={interlocuteurPhoto} alt={interlocuteurNom} className="w-8 h-8 rounded-full object-cover mr-3" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-3">
                    <span className="text-base font-bold text-green-700">{interlocuteurNom?.[0] || '?'}</span>
                  </div>
                )}
                <span className="flex-1">{interlocuteurNom}</span>
                <button
                  className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 border border-red-200"
                  onClick={() => handleDeleteConversation(selectedId)}
                  title="Supprimer la conversation"
                >
                  Supprimer
                </button>
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <MessagePanel
                  messages={messages}
                  onSend={handleSend}
                  userId={user?.id_utilisateur || "1"}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
