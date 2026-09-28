import type { BadgeTone } from "@/components/ui/Badge";
import type { IconName } from "@/components/ui/Icon";

export const ideaCategories: Record<string, { label: string; long: string; icon: IconName; description: string }> = {
  AMELIORATION: {
    label: "Amélioration",
    long: "Idée d'amélioration",
    icon: "trending-up",
    description: "Rendre un service ou un lieu meilleur",
  },
  SIGNALEMENT: {
    label: "Signalement",
    long: "Signalement de problème",
    icon: "alert-triangle",
    description: "Voirie, éclairage, propreté, sécurité…",
  },
  INVESTISSEMENT: {
    label: "Investissement",
    long: "Suggestion d'investissement",
    icon: "banknote",
    description: "Un équipement ou un projet à financer",
  },
  PROJET_COMMUNAUTAIRE: {
    label: "Projet communautaire",
    long: "Projet communautaire",
    icon: "users",
    description: "Une action à mener ensemble",
  },
};

// `f` pour les idées et demandes, `m` pour les commentaires.
export const moderationStatus: Record<string, { f: string; m: string; tone: BadgeTone }> = {
  PENDING: { f: "En attente", m: "En attente", tone: "amber" },
  APPROVED: { f: "Approuvée", m: "Approuvé", tone: "brand" },
  REJECTED: { f: "Rejetée", m: "Rejeté", tone: "red" },
};

export const newsTypes: Record<string, { label: string; tone: BadgeTone }> = {
  NEWS: { label: "Actualité", tone: "brand" },
  EVENT: { label: "Événement", tone: "accent" },
  MEETING: { label: "Réunion publique", tone: "neutral" },
};

export const projectStatus: Record<string, { label: string; tone: BadgeTone }> = {
  PLANNED: { label: "Planifié", tone: "neutral" },
  ONGOING: { label: "En cours", tone: "amber" },
  DONE: { label: "Terminé", tone: "brand" },
};

export const participationTypes: Record<string, { label: string; icon: IconName }> = {
  INITIATIVE: { label: "Participation à une initiative", icon: "sprout" },
  MAYOR_CANDIDACY: { label: "Membre de l'équipe municipale", icon: "landmark" },
};

export function plural(count: number, singular: string, pluralForm = `${singular}s`) {
  return `${count.toLocaleString("fr-FR")} ${count > 1 ? pluralForm : singular}`;
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  return date.toLocaleDateString("fr-FR", options);
}
