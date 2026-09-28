// Règles communes au navigateur (sélection des fichiers) et au serveur (validation).
// Le plafond total reste sous la limite de 4,5 Mo par requête imposée par Vercel.
export const ATTACHMENT_MAX_FILES = 5;
export const ATTACHMENT_MAX_TOTAL_BYTES = 4 * 1024 * 1024;
export const ATTACHMENT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ATTACHMENT_ACCEPTED_TYPES = [...ATTACHMENT_IMAGE_TYPES, "application/pdf"];

export function isImageType(mimeType: string) {
  return ATTACHMENT_IMAGE_TYPES.includes(mimeType);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} Mo`;
}
