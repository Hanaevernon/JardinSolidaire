const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log("🚀 Début du script de seed...");

const seedUtilisateur = require('./seed_utilisateur');
const seedCompetences = require('./seed_competences');
const seedJardin = require('./seed_jardin');
const seedReservation = require('./seed_reservation');

async function main() {
  console.log("👉 Lancement de main()");

  await seedCompetences();
  console.log("✅ seedCompetences terminé");

  await seedUtilisateur();
  console.log("✅ seedUtilisateur terminé");

  await seedJardin();
  console.log("✅ seedJardin terminé");

  await seedReservation();
  console.log("✅ seedReservation terminé");
}

main()
  .then(async () => {
    console.log('🎉 Tous les seeds exécutés avec succès.');
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Erreur pendant le seed :', e);
    await prisma.$disconnect();
    process.exit(1);
  });
