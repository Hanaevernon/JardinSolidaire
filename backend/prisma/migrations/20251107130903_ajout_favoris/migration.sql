-- CreateTable
CREATE TABLE "public"."favoris" (
    "id_favoris" BIGSERIAL NOT NULL,
    "id_utilisateur" BIGINT NOT NULL,
    "id_jardin" BIGINT,
    "id_jardinier" BIGINT,
    "date_ajout" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoris_pkey" PRIMARY KEY ("id_favoris")
);

-- CreateIndex
CREATE UNIQUE INDEX "favoris_id_utilisateur_id_jardin_key" ON "public"."favoris"("id_utilisateur", "id_jardin");

-- CreateIndex
CREATE UNIQUE INDEX "favoris_id_utilisateur_id_jardinier_key" ON "public"."favoris"("id_utilisateur", "id_jardinier");

-- AddForeignKey
ALTER TABLE "public"."favoris" ADD CONSTRAINT "favoris_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "public"."utilisateur"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."favoris" ADD CONSTRAINT "favoris_id_jardin_fkey" FOREIGN KEY ("id_jardin") REFERENCES "public"."jardin"("id_jardin") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."favoris" ADD CONSTRAINT "favoris_id_jardinier_fkey" FOREIGN KEY ("id_jardinier") REFERENCES "public"."jardiniers"("id_jardinier") ON DELETE NO ACTION ON UPDATE NO ACTION;
