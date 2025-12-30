-- CreateTable
CREATE TABLE "public"."jardiniers" (
    "id_jardinier" BIGSERIAL NOT NULL,
    "id_utilisateur" BIGINT NOT NULL,
    "titre" TEXT,
    "description" TEXT,
    "localisation" TEXT,
    "disponibilites" TEXT,
    "competences" TEXT,
    "photos" JSON,
    "date_creation" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "date_modification" TIMESTAMPTZ(6),

    CONSTRAINT "jardiniers_pkey" PRIMARY KEY ("id_jardinier")
);

-- AddForeignKey
ALTER TABLE "public"."jardiniers" ADD CONSTRAINT "jardiniers_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "public"."utilisateur"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION;
