"use client";

import dynamic from "next/dynamic";

export const CommuneMapLoader = dynamic(
  () => import("./CommuneMap").then((mod) => mod.CommuneMap),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full animate-pulse rounded-lg bg-slate-100" />,
  }
);
