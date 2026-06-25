export type DepartmentSeed = {
  name: string;
  slug: string;
  regionSlug: string;
};

// Découpage administratif des 14 régions en départements (référentiel public).
export const departments: DepartmentSeed[] = [
  // Dakar
  { name: "Dakar", slug: "dakar-dept", regionSlug: "dakar" },
  { name: "Pikine", slug: "pikine", regionSlug: "dakar" },
  { name: "Guédiawaye", slug: "guediawaye", regionSlug: "dakar" },
  { name: "Rufisque", slug: "rufisque", regionSlug: "dakar" },
  { name: "Keur Massar", slug: "keur-massar", regionSlug: "dakar" },
  // Thiès
  { name: "Thiès", slug: "thies-dept", regionSlug: "thies" },
  { name: "Mbour", slug: "mbour", regionSlug: "thies" },
  { name: "Tivaouane", slug: "tivaouane", regionSlug: "thies" },
  // Diourbel
  { name: "Diourbel", slug: "diourbel-dept", regionSlug: "diourbel" },
  { name: "Bambey", slug: "bambey", regionSlug: "diourbel" },
  { name: "Mbacké", slug: "mbacke", regionSlug: "diourbel" },
  // Fatick
  { name: "Fatick", slug: "fatick-dept", regionSlug: "fatick" },
  { name: "Foundiougne", slug: "foundiougne", regionSlug: "fatick" },
  { name: "Gossas", slug: "gossas", regionSlug: "fatick" },
  // Kaolack
  { name: "Kaolack", slug: "kaolack-dept", regionSlug: "kaolack" },
  { name: "Guinguinéo", slug: "guinguineo", regionSlug: "kaolack" },
  { name: "Nioro du Rip", slug: "nioro-du-rip", regionSlug: "kaolack" },
  // Kaffrine
  { name: "Kaffrine", slug: "kaffrine-dept", regionSlug: "kaffrine" },
  { name: "Birkilane", slug: "birkilane", regionSlug: "kaffrine" },
  { name: "Koungheul", slug: "koungheul", regionSlug: "kaffrine" },
  { name: "Malem Hodar", slug: "malem-hodar", regionSlug: "kaffrine" },
  // Louga
  { name: "Louga", slug: "louga-dept", regionSlug: "louga" },
  { name: "Kébémer", slug: "kebemer", regionSlug: "louga" },
  { name: "Linguère", slug: "linguere", regionSlug: "louga" },
  // Saint-Louis
  { name: "Saint-Louis", slug: "saint-louis-dept", regionSlug: "saint-louis" },
  { name: "Dagana", slug: "dagana", regionSlug: "saint-louis" },
  { name: "Podor", slug: "podor", regionSlug: "saint-louis" },
  // Matam
  { name: "Matam", slug: "matam-dept", regionSlug: "matam" },
  { name: "Kanel", slug: "kanel", regionSlug: "matam" },
  { name: "Ranérou Ferlo", slug: "ranerou-ferlo", regionSlug: "matam" },
  // Tambacounda
  { name: "Tambacounda", slug: "tambacounda-dept", regionSlug: "tambacounda" },
  { name: "Bakel", slug: "bakel", regionSlug: "tambacounda" },
  { name: "Goudiry", slug: "goudiry", regionSlug: "tambacounda" },
  { name: "Koumpentoum", slug: "koumpentoum", regionSlug: "tambacounda" },
  // Kédougou
  { name: "Kédougou", slug: "kedougou-dept", regionSlug: "kedougou" },
  { name: "Salémata", slug: "salemata", regionSlug: "kedougou" },
  { name: "Saraya", slug: "saraya", regionSlug: "kedougou" },
  // Kolda
  { name: "Kolda", slug: "kolda-dept", regionSlug: "kolda" },
  { name: "Médina Yoro Foulah", slug: "medina-yoro-foulah", regionSlug: "kolda" },
  { name: "Vélingara", slug: "velingara", regionSlug: "kolda" },
  // Sédhiou
  { name: "Sédhiou", slug: "sedhiou-dept", regionSlug: "sedhiou" },
  { name: "Bounkiling", slug: "bounkiling", regionSlug: "sedhiou" },
  { name: "Goudomp", slug: "goudomp", regionSlug: "sedhiou" },
  // Ziguinchor
  { name: "Ziguinchor", slug: "ziguinchor-dept", regionSlug: "ziguinchor" },
  { name: "Bignona", slug: "bignona", regionSlug: "ziguinchor" },
  { name: "Oussouye", slug: "oussouye", regionSlug: "ziguinchor" },
];
