-- CreateTable
CREATE TABLE "public"."demande" (
    "id_demande" BIGSERIAL NOT NULL,
    "id_utilisateur" BIGINT NOT NULL,
    "id_destinataire" BIGINT NOT NULL,
    "contenu" TEXT,
    "statut" TEXT,
    "date_demande" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demande_pkey" PRIMARY KEY ("id_demande")
);

-- AddForeignKey
ALTER TABLE "public"."demande" ADD CONSTRAINT "demande_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "public"."utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."demande" ADD CONSTRAINT "demande_id_destinataire_fkey" FOREIGN KEY ("id_destinataire") REFERENCES "public"."utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;
