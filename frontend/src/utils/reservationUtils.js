// src/utils/reservationUtils.js

export async function submitReservation({
  apiUrl,
  id_utilisateur,
  id_jardin,
  date_reservation,
  statut = "en_attente",
  commentaires = "",
  creneaux = []
}) {
  try {
    const response = await fetch(`${apiUrl}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_utilisateur: Number(id_utilisateur),
        id_jardin: Number(id_jardin),
        date_reservation,
        statut,
        commentaires,
        creneaux,
      }),
    });
    if (response.ok) {
      return { success: true, message: "Réservation enregistrée avec succès !" };
    } else {
      const err = await response.json();
      return { success: false, message: err.error || "Une erreur est survenue." };
    }
  } catch (error) {
    return { success: false, message: "Erreur réseau. Réessayez plus tard." };
  }
}
