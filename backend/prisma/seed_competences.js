const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function seedCompetences() {
  const competences = [
    "Jardin potager 🍅",
    "Création florale 🌸",
    "Permaculture douce 🌿",
    "Transmission & apprentissage 📚",
    "Tonte & soin des pelouses ✂️"
  ];

  for (const nom of competences) {
    await prisma.competence.upsert({
      where: { nom },
      update: {},
      create: { nom },
    });
  }

  console.log("✅ Compétences insérées !");
};
