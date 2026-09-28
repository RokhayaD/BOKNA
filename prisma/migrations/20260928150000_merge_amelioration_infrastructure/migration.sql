-- Fusion des catégories « Idée d'amélioration » et « Infrastructure » en une seule
-- catégorie « Amélioration d'infrastructure » (valeur AMELIORATION).

-- 1. Les idées déjà classées « Infrastructure » rejoignent la catégorie fusionnée.
UPDATE "Idea" SET "category" = 'AMELIORATION' WHERE "category" = 'INFRASTRUCTURE';

-- 2. Suppression de la valeur INFRASTRUCTURE de l'enum.
CREATE TYPE "IdeaCategory_new" AS ENUM ('AMELIORATION', 'SIGNALEMENT', 'INVESTISSEMENT', 'PROJET_COMMUNAUTAIRE');
ALTER TABLE "Idea" ALTER COLUMN "category" TYPE "IdeaCategory_new" USING ("category"::text::"IdeaCategory_new");
ALTER TYPE "IdeaCategory" RENAME TO "IdeaCategory_old";
ALTER TYPE "IdeaCategory_new" RENAME TO "IdeaCategory";
DROP TYPE "IdeaCategory_old";
