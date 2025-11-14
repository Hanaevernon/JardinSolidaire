require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
// Import des routes
const jardinsRoutes = require("./routes/jardins");
const jardiniersRoutes = require("./routes/jardiniers");
const reservationRoutes = require("./routes/reservation");
const annoncesRoutes = require("./routes/annonces");
const connexionRoutes = require("./routes/connexion");
const inscriptionRoutes = require("./routes/inscription");
const mdpOublieRoutes = require("./routes/mdp_oublie");
const modifierMdpRoutes = require("./routes/modifier_mdp");
const navbarRoute = require("./routes/navbar");
const pageJardinRoute = require("./routes/pageJardin");
const confirmationResaJardiniers = require("./routes/confirmation_resa_jardiniers");
const confirmationResaJardins = require("./routes/confirmation_resa_jardins");
const validationResaJardins = require("./routes/validation_resa_jardins");
const validationResaJardiniers = require("./routes/validation_resa_jardiniers");
const utilisateurRoute = require("./routes/utilisateur");
const messagerieRoutes = require("./routes/messagerie");

const disponibilitesRoutes = require("./routes/disponibilites");
const favorisRoutes = require("./routes/favoris");


const app = express();
const PORT = process.env.PORT || 5001;

// --- Middlewares ---
// CORS doit être placé AVANT toutes les routes
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// --- Routes API ---
app.use("/api/messagerie", messagerieRoutes);

// --- Routes API ---
app.use("/api/jardins", jardinsRoutes);
app.use("/api/jardiniers", jardiniersRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/annonces", annoncesRoutes);
app.use("/api/auth/connexion", connexionRoutes);
app.use("/api/auth/inscription", inscriptionRoutes);
app.use("/api/auth/mdp-oublie", mdpOublieRoutes);
app.use("/api/auth/modifier-mdp", modifierMdpRoutes);
app.use("/api/utilisateur/navbar", navbarRoute);
app.use("/api/jardins/page", pageJardinRoute);
app.use("/api/reservations/confirmation/jardiniers", confirmationResaJardiniers);
app.use("/api/reservations/confirmation/jardins", confirmationResaJardins);
app.use("/api/reservations/validation/jardins", validationResaJardins);
app.use("/api/reservations/validation/jardiniers", validationResaJardiniers);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/utilisateur", utilisateurRoute);

app.use("/api/disponibilites", disponibilitesRoutes);
app.use("/api/favoris", favorisRoutes);

// --- 404 handler ---
app.use((req, res, next) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// --- Gestion d'erreurs globales ---
app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err);
  res.status(500).json({ error: "Erreur serveur" });
});

// --- Lancement du serveur ---
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
