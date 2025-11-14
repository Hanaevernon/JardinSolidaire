const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Récupérer toutes les conversations d'un utilisateur (liste des personnes avec qui il a échangé)
router.get('/conversations/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    // On récupère tous les utilisateurs avec qui il y a eu un échange (envoyeur OU destinataire)
    const messages = await prisma.messagerie.findMany({
      where: {
        OR: [
          { id_envoyeur: userId },
          { id_destinataire: userId }
        ]
      },
      orderBy: { date_envoi: 'desc' }
    });
    console.log('[Backend] Messages trouvés:', messages);
    // On regroupe par interlocuteur
    const interlocuteurs = {};
    messages.forEach(msg => {
      const env = Number(msg.id_envoyeur);
      const dest = Number(msg.id_destinataire);
      const otherId = env === userId ? dest : env;
      if (!otherId) return;
      if (!interlocuteurs[otherId]) {
        interlocuteurs[otherId] = {
          id: otherId,
          lastMessage: msg.contenu,
          lastDate: msg.date_envoi,
        };
      }
    });
    console.log('[Backend] Interlocuteurs regroupés:', interlocuteurs);
    // On récupère les infos utilisateurs ET jardiniers
    const ids = Object.keys(interlocuteurs).map(Number);
    console.log('[Backend] Ids à chercher:', ids);
    if (ids.length === 0) {
      return res.json([]);
    }
    // Récupère les utilisateurs
    const users = await prisma.utilisateur.findMany({
      where: { id_utilisateur: { in: ids } },
      select: { id_utilisateur: true, prenom: true, nom: true, photo_profil: true }
    });
    console.log('[Backend] Utilisateurs trouvés:', users);
    // Récupère les ids non trouvés dans utilisateur
    const userIds = users.map(u => Number(u.id_utilisateur));
    const missingIds = ids.filter(id => !userIds.includes(id));
    console.log('[Backend] Ids manquants (jardiniers):', missingIds);
    let jardiniers = [];
    if (missingIds.length > 0) {
      jardiniers = await prisma.jardiniers.findMany({
        where: { id_utilisateur: { in: missingIds } },
        select: { id_jardinier: true, id_utilisateur: true, titre: true, prenom: true, nom: true, photos: true }
      });
      console.log('[Backend] Jardiniers trouvés:', jardiniers);
    }
    const conversations = [
      ...users.map(u => ({
        id: Number(u.id_utilisateur),
        nom: `${u.prenom || ''} ${u.nom || ''}`.trim() || 'Utilisateur',
        photo: u.photo_profil,
        lastMessage: interlocuteurs[u.id_utilisateur].lastMessage,
        lastDate: interlocuteurs[u.id_utilisateur].lastDate
      })),
      ...jardiniers.map(j => ({
        id: Number(j.id_utilisateur), // Utilise l'id_utilisateur pour la messagerie
        nom: ((j.prenom || '') + ' ' + (j.nom || '')).trim() || 'Jardinier',
        photo: Array.isArray(j.photos) ? j.photos[0] : (typeof j.photos === 'string' && j.photos.startsWith('[') ? JSON.parse(j.photos)[0] : null),
        lastMessage: interlocuteurs[j.id_utilisateur]?.lastMessage,
        lastDate: interlocuteurs[j.id_utilisateur]?.lastDate
      }))
    ];
    console.log('[Backend] Conversations finales:', conversations);
    res.json(conversations);
  } catch (e) {
    console.error('Erreur /conversations/:userId', e);
    res.status(500).json({ error: e.message });
  }
});

// Récupérer les messages d'une conversation (entre userId et interlocuteurId)
router.get('/messages/:interlocuteurId', async (req, res) => {
  const userId = parseInt(req.query.userId); // doit être passé en query
  const interlocuteurId = parseInt(req.params.interlocuteurId);
  if (!userId) return res.status(400).json({ error: 'userId manquant' });
  try {
    const messages = await prisma.messagerie.findMany({
      where: {
        OR: [
          { id_envoyeur: userId, id_destinataire: interlocuteurId },
          { id_envoyeur: interlocuteurId, id_destinataire: userId }
        ]
      },
      orderBy: { date_envoi: 'asc' }
    });
    if (!messages || messages.length === 0) {
      return res.json([]);
    }
    // Récupère les infos utilisateurs ET jardiniers pour chaque message (expéditeur)
    const userIds = Array.from(new Set(messages.map(m => Number(m.id_envoyeur))));
    const users = await prisma.utilisateur.findMany({
      where: { id_utilisateur: { in: userIds } },
      select: { id_utilisateur: true, prenom: true, nom: true, photo_profil: true }
    });
    const userMap = {};
    users.forEach(u => {
      userMap[u.id_utilisateur] = {
        nom: `${u.prenom || ''} ${u.nom || ''}`.trim() || 'Utilisateur',
        photo: u.photo_profil || null
      };
    });
    // Pour les ids non trouvés dans utilisateur, chercher dans jardiniers
    const foundUserIds = users.map(u => Number(u.id_utilisateur));
    const missingIds = userIds.filter(id => !foundUserIds.includes(id));
    let jardinierMap = {};
    if (missingIds.length > 0) {
      const jardiniers = await prisma.jardiniers.findMany({
        where: { id_jardinier: { in: missingIds } },
        select: { id_jardinier: true, titre: true, prenom: true, nom: true, photos: true }
      });
      jardiniers.forEach(j => {
        jardinierMap[j.id_jardinier] = {
          nom: ((j.prenom || '') + ' ' + (j.nom || '')).trim() || j.titre || 'Jardinier',
          photo: Array.isArray(j.photos) ? j.photos[0] : (typeof j.photos === 'string' && j.photos.startsWith('[') ? JSON.parse(j.photos)[0] : null)
        };
      });
    }
    res.json(messages.map(m => {
      const exp = userMap[m.id_envoyeur] || jardinierMap[m.id_envoyeur] || {};
      return {
        from: Number(m.id_envoyeur),
        to: Number(m.id_destinataire),
        text: m.contenu,
        date: m.date_envoi,
        lu: m.lu,
        nom: exp.nom || 'Utilisateur',
        photo: exp.photo || null
      };
    }));
  } catch (e) {
    console.error('Erreur /messages/:interlocuteurId', e);
    res.status(500).json({ error: e.message });
  }
});

// Envoyer un message
router.post('/messages', async (req, res) => {
  const { from, to, text, nom } = req.body;
  if (!from || !to || !text) return res.status(400).json({ error: 'Champs manquants' });
  try {
    // Log expéditeur et destinataire
    const expediteur = await prisma.utilisateur.findUnique({ where: { id_utilisateur: parseInt(from) } });
    // Vérifie si le destinataire est un utilisateur ou un jardinier
    let destinataireUser = await prisma.utilisateur.findUnique({ where: { id_utilisateur: parseInt(to) } });
    let destinataireJardinier = null;
    if (!destinataireUser) {
      destinataireJardinier = await prisma.jardiniers.findUnique({ where: { id_jardinier: parseInt(to) } });
    }
    console.log('--- ENVOI MESSAGE ---');
    console.log('Expéditeur:', from, expediteur ? expediteur.email : 'inconnu');
    if (destinataireUser) {
      console.log('Destinataire utilisateur:', to, destinataireUser.email || destinataireUser.nom || 'inconnu');
    } else if (destinataireJardinier) {
      console.log('Destinataire jardinier:', to, destinataireJardinier.prenom || destinataireJardinier.nom || destinataireJardinier.titre || 'inconnu');
    } else {
      console.log('Destinataire inconnu:', to);
    }
    // Ne crée pas d'utilisateur fictif si le destinataire est un jardinier
    if (!expediteur) {
      console.error('Expéditeur inexistant en base !', { from });
      return res.status(400).json({ error: `L'expéditeur (id ${from}) n'existe pas dans la base utilisateur. Veuillez vérifier votre compte ou vous reconnecter.` });
    }
    // Enregistre le message normalement
    const message = await prisma.messagerie.create({
      data: {
        id_envoyeur: parseInt(from),
        id_destinataire: parseInt(to),
        contenu: text,
        lu: false
      }
    });
    // Conversion BigInt -> Number pour JSON
    const safeMessage = {};
    for (const key in message) {
      const value = message[key];
      safeMessage[key] = typeof value === 'bigint' ? Number(value) : value;
    }
    res.json({ success: true, message: safeMessage });
  } catch (e) {
    console.error('Erreur POST /messages', e);
    res.status(500).json({ error: e.message });
  }
});

// Supprimer une conversation (tous les messages entre userId et otherId)
router.delete('/conversations/:userId/:otherId', async (req, res) => {
  const userId = Number(req.params.userId);
  const otherId = Number(req.params.otherId);
  try {
    const deleted = await prisma.messagerie.deleteMany({
      where: {
        OR: [
          { id_envoyeur: userId, id_destinataire: otherId },
          { id_envoyeur: otherId, id_destinataire: userId }
        ]
      }
    });
    res.json({ success: true, count: deleted.count });
  } catch (e) {
    console.error('Erreur suppression conversation', e);
    res.status(500).json({ error: e.message });
  }
});
module.exports = router;
