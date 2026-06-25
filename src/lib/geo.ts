import { prisma } from "@/lib/prisma";

export async function getGeoTree() {
  const regions = await prisma.region.findMany({
    orderBy: { name: "asc" },
    include: {
      departments: {
        orderBy: { name: "asc" },
        include: {
          communes: {
            orderBy: { name: "asc" },
            select: { id: true, name: true, slug: true },
          },
        },
      },
    },
  });
  return regions;
}

export type GeoTree = Awaited<ReturnType<typeof getGeoTree>>;
