// db.js
const { Pool } = require("pg");
require("dotenv").config(); // Charge les variables du .env

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "postgres",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Log connexion
pool.on("connect", () => {
  console.log("✅ Connecté à PostgreSQL");
});

// Gestion d'erreurs
pool.on("error", (err) => {
  console.error("❌ Erreur PostgreSQL :", err.message);
});

// Vérification de la connexion au lancement
(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("📡 Test de connexion PostgreSQL réussi");
  } catch (err) {
    console.error("🚨 Impossible de se connecter à PostgreSQL :", err.message);
  }
})();

module.exports = pool;
