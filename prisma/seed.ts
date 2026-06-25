import { PrismaClient, IdeaCategory, NewsType, ProjectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { regions } from "./seed-data/regions";
import { departments } from "./seed-data/departments";
import { communes } from "./seed-data/communes";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding régions...");
  const regionBySlug = new Map<string, string>();
  for (const r of regions) {
    const created = await prisma.region.upsert({
      where: { slug: r.slug },
      update: { name: r.name, centroidLat: r.lat, centroidLng: r.lng },
      create: { name: r.name, slug: r.slug, centroidLat: r.lat, centroidLng: r.lng },
    });
    regionBySlug.set(r.slug, created.id);
  }

  console.log("Seeding départements...");
  const departmentBySlug = new Map<string, string>();
  const departmentNameBySlug = new Map(departments.map((d) => [d.slug, d.name]));
  for (const d of departments) {
    const regionId = regionBySlug.get(d.regionSlug);
    if (!regionId) throw new Error(`Région inconnue: ${d.regionSlug}`);
    const created = await prisma.department.upsert({
      where: { slug: d.slug },
      update: { name: d.name, regionId },
      create: { name: d.name, slug: d.slug, regionId },
    });
    departmentBySlug.set(d.slug, created.id);
  }

  console.log("Seeding communes...");
  const communeBySlug = new Map<string, string>();
  for (const c of communes) {
    const departmentId = departmentBySlug.get(c.departmentSlug);
    if (!departmentId) throw new Error(`Département inconnu: ${c.departmentSlug}`);
    const departmentName = departmentNameBySlug.get(c.departmentSlug);
    const description = c.description ?? `Commune du département de ${departmentName}.`;
    const created = await prisma.commune.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        departmentId,
        population: c.population,
        description,
        centroidLat: c.lat,
        centroidLng: c.lng,
      },
      create: {
        name: c.name,
        slug: c.slug,
        departmentId,
        population: c.population,
        description,
        centroidLat: c.lat,
        centroidLng: c.lng,
      },
    });
    communeBySlug.set(c.slug, created.id);
  }

  console.log("Seeding utilisateurs de démonstration...");
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@bokna.sn" },
    update: {},
    create: {
      name: "Administrateur Bokna",
      email: "admin@bokna.sn",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const citizenPasswordHash = await bcrypt.hash("citoyen123", 10);
  const plateauId = communeBySlug.get("plateau")!;
  const medinaId = communeBySlug.get("medina")!;
  const citizen = await prisma.user.upsert({
    where: { email: "citoyen@bokna.sn" },
    update: { communeId: plateauId },
    create: {
      name: "Aïssatou Citoyenne",
      email: "citoyen@bokna.sn",
      passwordHash: citizenPasswordHash,
      role: "CITIZEN",
      communeId: plateauId,
    },
  });

  console.log("Seeding projets en cours...");
  const projectSeeds: { communeSlug: string; title: string; description: string; status: ProjectStatus }[] = [
    { communeSlug: "fann-point-e-amitie", title: "Réhabilitation de la Corniche", description: "Travaux d'aménagement piéton et d'éclairage public le long de la Corniche Ouest.", status: "ONGOING" },
    { communeSlug: "thies-nord", title: "Modernisation du marché central", description: "Extension et mise aux normes du marché central de Thiès.", status: "PLANNED" },
    { communeSlug: "saint-louis", title: "Protection du littoral", description: "Construction d'épis rocheux pour lutter contre l'érosion côtière à Guet Ndar.", status: "ONGOING" },
    { communeSlug: "ziguinchor", title: "Réseau d'adduction d'eau potable", description: "Extension du réseau d'eau potable vers les quartiers périphériques.", status: "ONGOING" },
  ];
  for (const p of projectSeeds) {
    const communeId = communeBySlug.get(p.communeSlug);
    if (!communeId) continue;
    const existing = await prisma.project.findFirst({ where: { communeId, title: p.title } });
    if (!existing) {
      await prisma.project.create({
        data: { communeId, title: p.title, description: p.description, status: p.status },
      });
    }
  }

  console.log("Seeding une idée et une actualité de démonstration...");
  const existingIdea = await prisma.idea.findFirst({ where: { title: "Plus d'éclairage public à Médina" } });
  if (!existingIdea) {
    await prisma.idea.create({
      data: {
        title: "Plus d'éclairage public à Médina",
        description: "Plusieurs rues du quartier Médina manquent d'éclairage public, ce qui pose un problème de sécurité la nuit.",
        category: IdeaCategory.SIGNALEMENT,
        authorId: citizen.id,
        communeId: medinaId,
        status: "APPROVED",
      },
    });
  }

  const existingNews = await prisma.news.findFirst({ where: { title: "Lancement de la plateforme Bokna" } });
  if (!existingNews) {
    await prisma.news.create({
      data: {
        title: "Lancement de la plateforme Bokna",
        content: "Bokna ouvre ses portes : proposez vos idées, suivez l'actualité de votre commune et participez à la vie municipale.",
        type: NewsType.NEWS,
        authorId: admin.id,
      },
    });
  }

  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
