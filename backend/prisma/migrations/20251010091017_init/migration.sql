-- CreateTable
CREATE TABLE "avis" (
    "id_avis" BIGSERIAL NOT NULL,
    "id_utilisateur" BIGINT,
    "id_jardin" BIGINT,
    "note" INTEGER,
    "commentaire" TEXT,
    "date_avis" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avis_pkey" PRIMARY KEY ("id_avis")
);

-- CreateTable
CREATE TABLE "disponibilites" (
    "id_disponibilite" BIGSERIAL NOT NULL,
    "id_jardin" BIGINT,
    "date_dispo" DATE,
    "heure_debut" TIME(6),
    "heure_fin" TIME(6),
    "statut" TEXT,

    CONSTRAINT "disponibilites_pkey" PRIMARY KEY ("id_disponibilite")
);

-- CreateTable
CREATE TABLE "heurescumulées" (
    "id_historique" BIGSERIAL NOT NULL,
    "id_utilisateur" BIGINT,
    "heures_travaillees" DOUBLE PRECISION,
    "date_maj" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "heurescumulées_pkey" PRIMARY KEY ("id_historique")
);

-- CreateTable
CREATE TABLE "jardin" (
    "id_jardin" BIGSERIAL NOT NULL,
    "id_proprietaire" BIGINT NOT NULL,
    "titre" TEXT,
    "description" TEXT,
    "adresse" TEXT,
    "superficie" DOUBLE PRECISION,
    "type" TEXT,
    "besoins" TEXT,
    "photos" JSON,
    "date_publication" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT,
    "note_moyenne" DOUBLE PRECISION,
    "region" TEXT,

    CONSTRAINT "jardin_pkey" PRIMARY KEY ("id_jardin")
);

-- CreateTable
CREATE TABLE "messagerie" (
    "id_message" BIGSERIAL NOT NULL,
    "id_envoyeur" BIGINT,
    "id_destinataire" BIGINT,
    "contenu" TEXT,
    "date_envoi" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "lu" BOOLEAN DEFAULT false,

    CONSTRAINT "messagerie_pkey" PRIMARY KEY ("id_message")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id_reservation" BIGSERIAL NOT NULL,
    "id_utilisateur" BIGINT,
    "id_jardin" BIGINT,
    "id_disponibilite" BIGINT,
    "statut" TEXT,
    "date_reservation" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "commentaires" TEXT,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id_reservation")
);

-- CreateTable
CREATE TABLE "utilisateur" (
    "id_utilisateur" BIGSERIAL NOT NULL,
    "prenom" TEXT,
    "nom" TEXT,
    "email" TEXT,
    "mot_de_passe" TEXT,
    "role" TEXT,
    "photo_profil" TEXT,
    "biographie" TEXT,
    "date_inscription" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "telephone" TEXT,
    "adresse" TEXT,
    "note_moyenne" DOUBLE PRECISION,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "competence" (
    "id_competence" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "competence_pkey" PRIMARY KEY ("id_competence")
);

-- CreateTable
CREATE TABLE "utilisateurCompetence" (
    "id_utilisateur_competence" SERIAL NOT NULL,
    "id_utilisateur" BIGINT NOT NULL,
    "id_competence" INTEGER NOT NULL,

    CONSTRAINT "utilisateurCompetence_pkey" PRIMARY KEY ("id_utilisateur_competence")
);

-- CreateIndex
CREATE UNIQUE INDEX "jardin_id_proprietaire_key" ON "jardin"("id_proprietaire");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_email_key" ON "utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "competence_nom_key" ON "competence"("nom");

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_id_jardin_fkey" FOREIGN KEY ("id_jardin") REFERENCES "jardin"("id_jardin") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "disponibilites" ADD CONSTRAINT "disponibilites_id_jardin_fkey" FOREIGN KEY ("id_jardin") REFERENCES "jardin"("id_jardin") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "heurescumulées" ADD CONSTRAINT "heurescumulées_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jardin" ADD CONSTRAINT "jardin_id_proprietaire_fkey" FOREIGN KEY ("id_proprietaire") REFERENCES "utilisateur"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messagerie" ADD CONSTRAINT "messagerie_id_destinataire_fkey" FOREIGN KEY ("id_destinataire") REFERENCES "utilisateur"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messagerie" ADD CONSTRAINT "messagerie_id_envoyeur_fkey" FOREIGN KEY ("id_envoyeur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_id_disponibilite_fkey" FOREIGN KEY ("id_disponibilite") REFERENCES "disponibilites"("id_disponibilite") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_id_jardin_fkey" FOREIGN KEY ("id_jardin") REFERENCES "jardin"("id_jardin") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "utilisateurCompetence" ADD CONSTRAINT "utilisateurCompetence_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilisateurCompetence" ADD CONSTRAINT "utilisateurCompetence_id_competence_fkey" FOREIGN KEY ("id_competence") REFERENCES "competence"("id_competence") ON DELETE RESTRICT ON UPDATE CASCADE;
