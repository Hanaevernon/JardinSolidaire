"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../components/Pageconnexion/InputField";
import Link from "next/link";

export default function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailInvalide, setEmailInvalide] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setEmailInvalide(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/mdp-oublie`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("📩 Un e-mail de réinitialisation a été envoyé !");
        // → Pas besoin de localStorage ni redirection immédiate
      } else {
        setEmailInvalide(true);
        setMessage(
          "🌿 Cette adresse e-mail n'est pas connue. Créez un compte pour rejoindre JardinSolidaire."
        );
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-20">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-green-900 text-center mb-4">
          Mot de passe oublié ?
        </h2>
        <p className="text-green-700 text-center mb-6">
          Pas de panique 🌱 <br />
          Entrez votre e-mail et nous vous enverrons un lien de réinitialisation.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse e-mail"
            required
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-lg transition"
          >
            Réinitialiser le mot de passe
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-4 ${
              emailInvalide ? "text-red-600" : "text-green-700"
            }`}
          >
            {message}
          </p>
        )}

        {emailInvalide && (
          <p className="text-center mt-2">
            <Link href="/inscription" className="text-green-600 hover:underline">
              Créer un compte
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
