"use client";
import { useEffect } from "react";

const ReservationsPage = () => {
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      
      // Redirection selon le rôle
      if (userData.role === "proprietaire") {
        // Pour les propriétaires, rediriger vers les demandes reçues par défaut
        window.location.href = "/demandes-recues";
      } else {
        // Pour les amis du vert, rediriger vers leurs réservations de jardins
        window.location.href = "/mes-reservations-jardins";
      }
    } else {
      window.location.href = "/connexion";
    }
  }, []);

  // Affichage de chargement pendant la redirection
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection en cours...</p>
      </div>
    </div>
  );
};

export default ReservationsPage;