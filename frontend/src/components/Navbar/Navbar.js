"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSeedling } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [hasAnnonce, setHasAnnonce] = useState(false);
  const [notifDemandes, setNotifDemandes] = useState(0);
  const [notifMessages, setNotifMessages] = useState(0);
  const [notifReservations, setNotifReservations] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // 🔹 Vérifier si l’utilisateur a déjà une annonce
      const userId = userData.id_utilisateur;
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/utilisateur/navbar/${userId}/has-annonce`
      )
        .then((res) => res.json())
        .then((data) => setHasAnnonce(data.hasAnnonce))
        .catch((err) => console.error("Erreur récupération annonce :", err));

      // 🔹 Récupérer le nombre de demandes reçues non traitées
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/demandes/non-traitees/${userId}`)
        .then((res) => res.json())
        .then((data) => setNotifDemandes(data.count || 0))
        .catch((err) => console.error("Erreur récupération notifications demandes :", err));

      // 🔹 Récupérer le nombre de nouveaux messages non lus
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/non-lus/${userId}`)
        .then((res) => res.json())
        .then((data) => setNotifMessages(data.count || 0))
        .catch((err) => console.error("Erreur récupération notifications messages :", err));

      // 🔹 Récupérer le nombre de nouvelles réservations à traiter
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations/non-traitees/${userId}`)
        .then((res) => res.json())
        .then((data) => setNotifReservations(data.count || 0))
        .catch((err) => console.error("Erreur récupération notifications réservations :", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const renderButtons = () => {
    if (!user) {
      return (
        <>
          <Link href="/connexion">
            <button className="bg-[#e3107d] hover:bg-pink-700 text-white px-4 py-2 rounded">
              Se connecter
            </button>
          </Link>
          <Link href="/inscription">
            <button className="bg-[#e3107d] hover:bg-pink-700 text-white px-4 py-2 rounded">
              S’inscrire
            </button>
          </Link>
        </>
      );
    }

    if (user.role === "proprietaire") {
      return (
        <Link href="/ajouter-jardin">
          <button className="bg-[#e3107d] hover:bg-pink-700 text-white px-4 py-2 rounded">
            Ajouter mon jardin
          </button>
        </Link>
      );
    }

    if (user.role === "ami_du_vert") {
      return (
        <Link href="/je-veux-jardiner">
          <button className="bg-[#e3107d] hover:bg-pink-700 text-white px-4 py-2 rounded">
            Je veux jardiner
          </button>
        </Link>
      );
    }

    return null;
  };

  return (
    <nav className="w-full bg-green-600 text-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <FontAwesomeIcon icon={faSeedling} size="lg" className="mr-2" />
          <span className="text-xl font-bold">JardinSolidaire</span>
        </Link>

        <div className="flex items-center">
          <div className="hidden md:flex space-x-4 mr-4">{renderButtons()}</div>

          {user && (
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer relative"
            >
              {menuOpen ? (
                <FontAwesomeIcon icon={faTimes} size="lg" />
              ) : (
                <FontAwesomeIcon icon={faBars} size="lg" />
              )}
              {(notifDemandes > 0 || notifMessages > 0 || notifReservations > 0) && !menuOpen && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                  ●
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {menuOpen && user && (
        <div className="bg-green-600 w-full absolute top-16 left-0">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link href="/profile" className="block" onClick={() => setMenuOpen(false)}>
                Mon Profil
              </Link>
            </li>
            <li>
              <Link href="/messagerie" className="block relative" onClick={() => setMenuOpen(false)}>
                Ma messagerie
                {notifMessages > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                    {notifMessages}
                  </span>
                )}
              </Link>
            </li>
           
            {(user.role === "proprietaire" || user.role === "ami_du_vert") && (
              <>
                <li>
                  <Link href="/demandes-recues" className="block relative" onClick={() => setMenuOpen(false)}>
                    Demandes reçues
                    {notifDemandes > 0 && (
                      <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                        {notifDemandes}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link href="/mes-reservations" className="block relative" onClick={() => setMenuOpen(false)}>
                    Mes réservations
                    {notifReservations > 0 && (
                      <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                        {notifReservations}
                      </span>
                    )}
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link href="/mes-favoris" className="block" onClick={() => setMenuOpen(false)}>
                Mes Favoris
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block text-left w-full"
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
