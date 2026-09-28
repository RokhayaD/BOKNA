import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Pièces jointes des idées : 4 Mo maximum au total (voir src/lib/attachments.ts),
      // plus les champs texte du formulaire.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
