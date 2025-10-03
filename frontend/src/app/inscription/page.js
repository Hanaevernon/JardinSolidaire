"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Inscription() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/inscription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prenom, nom, email, password, role }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        login(data.user);

        // Vérifie si une réservation était en attente
        const pending = localStorage.getItem("pending_reservation");
        if (pending) {
          localStorage.removeItem("pending_reservation");
          router.push("/reservation");
        } else {
          // Redirection classique
          if (role === "ami_du_vert") router.push("/jardins");
          else if (role === "proprietaire") router.push("/jardiniers");
          else router.push("/");
        }
      } else {
        setErrorMessage(data.error || "Erreur lors de l’inscription.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setErrorMessage("Impossible de contacter le serveur.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-green-900 text-center mb-4">
          Bienvenue sur JardinSolidaire 🌿
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Votre prénom"
            required
            className="w-full border-2 border-green-500 rounded-lg px-4 py-2"
          />

          <input
            type="text"
            name="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Votre nom"
            required
            className="w-full border-2 border-green-500 rounded-lg px-4 py-2"
          />

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse e-mail"
            required
            className="w-full border-2 border-green-500 rounded-lg px-4 py-2"
          />

          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className="w-full border-2 border-green-500 rounded-lg px-4 py-2"
          />

          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full border-2 border-green-500 rounded-lg px-4 py-2"
          >
            <option value="">Choisissez votre rôle</option>
            <option value="proprietaire">Je possède un jardin</option>
            <option value="ami_du_vert">Je veux jardiner</option>
          </select>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-2"
          >
            S’inscrire
          </button>

          {errorMessage && (
            <p className="text-red-600 text-center mt-2">{errorMessage}</p>
          )}
        </form>

        <p className="text-center text-sm text-gray-700 mt-6">
          Déjà inscrit ?{" "}
          <Link href="/connexion" className="text-green-800 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
