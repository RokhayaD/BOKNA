import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Adresse email invalide."),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
  communeId: z.string().min(1, "Veuillez choisir votre commune."),
});

export const ideaSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères."),
  description: z.string().min(20, "Merci de détailler votre idée (20 caractères minimum)."),
  category: z.enum(["AMELIORATION", "SIGNALEMENT", "INVESTISSEMENT", "PROJET_COMMUNAUTAIRE"], {
    message: "Veuillez choisir une catégorie.",
  }),
  communeId: z.string().min(1, "Veuillez choisir une commune."),
  visibility: z.enum(["PUBLIC", "PRIVATE"], { message: "Veuillez choisir la visibilité de l'idée." }),
  // Montant en FCFA, saisi avec séparateurs de milliers : on ne garde que les chiffres.
  estimatedCost: z
    .string()
    .optional()
    .transform((v) => (v ?? "").replace(/\D/g, ""))
    .refine((v) => v.length <= 15, "Le coût estimatif semble trop élevé.")
    .transform((v) => (v ? BigInt(v) : null)),
});

export const regionSchema = z.object({
  id: z.string().min(1),
  capital: z.string().trim().max(100).optional(),
  description: z.string().trim().max(3000).optional(),
  highlights: z.string().optional(),
  area: z.string().optional(),
  population: z.string().optional(),
});

export const commentSchema = z.object({
  ideaId: z.string().min(1),
  content: z.string().min(2, "Le commentaire est trop court.").max(2000),
});

export const participationSchema = z
  .object({
    communeId: z.string().min(1, "Veuillez choisir une commune."),
    type: z.enum(["INITIATIVE", "MAYOR_CANDIDACY"]),
    message: z.string().min(20, "Merci de détailler votre demande (20 caractères minimum)."),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine(
    (data) =>
      data.type !== "MAYOR_CANDIDACY" ||
      (!!data.firstName?.trim() && !!data.lastName?.trim() && !!data.phone?.trim()),
    {
      message: "Merci de renseigner votre nom, prénom et numéro de téléphone.",
      path: ["firstName"],
    }
  );

export const newsSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(20),
  type: z.enum(["NEWS", "EVENT", "MEETING"]),
  communeId: z.string().optional(),
  regionId: z.string().optional(),
  eventDate: z.string().optional(),
});
