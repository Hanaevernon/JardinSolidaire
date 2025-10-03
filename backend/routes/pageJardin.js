const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM jardin WHERE id_jardin = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Jardin introuvable" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
