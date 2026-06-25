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
  category: z.enum(["AMELIORATION", "SIGNALEMENT", "INVESTISSEMENT", "PROJET_COMMUNAUTAIRE"]),
  communeId: z.string().min(1, "Veuillez choisir une commune."),
});

export const commentSchema = z.object({
  ideaId: z.string().min(1),
  content: z.string().min(2, "Le commentaire est trop court.").max(2000),
});

export const participationSchema = z.object({
  communeId: z.string().min(1, "Veuillez choisir une commune."),
  type: z.enum(["INITIATIVE", "MAYOR_CANDIDACY"]),
  message: z.string().min(20, "Merci de détailler votre demande (20 caractères minimum)."),
});

export const newsSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(20),
  type: z.enum(["NEWS", "EVENT", "MEETING"]),
  communeId: z.string().optional(),
  regionId: z.string().optional(),
  eventDate: z.string().optional(),
});
