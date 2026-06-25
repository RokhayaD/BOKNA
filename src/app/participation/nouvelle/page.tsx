import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getGeoTree } from "@/lib/geo";
import { ParticipationForm } from "@/components/ParticipationForm";

export default async function NewParticipationPage({
  searchParams,
}: {
  searchParams: Promise<{ communeId?: string; type?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/participation/nouvelle");

  const { communeId, type } = await searchParams;
  const tree = await getGeoTree();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Participer à la vie municipale</h1>
      <ParticipationForm tree={tree} defaultCommuneId={communeId} defaultType={type} />
    </div>
  );
}
