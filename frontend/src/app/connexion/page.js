"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/connexion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
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
          if (data.user.role === "ami_du_vert") router.push("/");
          else if (data.user.role === "proprietaire") router.push("/");
          else router.push("/");
        }
      } else {
        setErrorMessage(data.error || "Identifiant ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setErrorMessage("Erreur de connexion. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-20">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-green-900 text-center mb-4">
          Connexion à JardinSolidaire
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse e-mail"
            required
            className="w-full border-2 border-green-500 rounded-lg px-4 py-2"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              className="w-full border-2 border-green-500 rounded-lg px-4 py-2 pr-20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-sm"
            >
              {showPassword ? "Masquer" : "Afficher"}
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-2"
          >
            Se connecter
          </button>

          {errorMessage && (
            <p className="text-red-600 text-center mt-2">{errorMessage}</p>
          )}
        </form>

        <p className="text-center text-sm text-gray-700 mt-6">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-green-800 hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
