export type RegionSeed = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
};

// Coordonnées approximatives des chefs-lieux régionaux (à usage démonstratif).
export const regions: RegionSeed[] = [
  { name: "Dakar", slug: "dakar", lat: 14.6928, lng: -17.4467 },
  { name: "Thiès", slug: "thies", lat: 14.791, lng: -16.9359 },
  { name: "Diourbel", slug: "diourbel", lat: 14.6552, lng: -16.2342 },
  { name: "Fatick", slug: "fatick", lat: 14.339, lng: -16.411 },
  { name: "Kaolack", slug: "kaolack", lat: 14.1612, lng: -16.0728 },
  { name: "Kaffrine", slug: "kaffrine", lat: 14.1059, lng: -15.55 },
  { name: "Louga", slug: "louga", lat: 15.6173, lng: -16.224 },
  { name: "Saint-Louis", slug: "saint-louis", lat: 16.0179, lng: -16.4896 },
  { name: "Matam", slug: "matam", lat: 15.6559, lng: -13.2548 },
  { name: "Tambacounda", slug: "tambacounda", lat: 13.7707, lng: -13.6673 },
  { name: "Kédougou", slug: "kedougou", lat: 12.5556, lng: -12.1746 },
  { name: "Kolda", slug: "kolda", lat: 12.8939, lng: -14.941 },
  { name: "Sédhiou", slug: "sedhiou", lat: 12.7081, lng: -15.5569 },
  { name: "Ziguinchor", slug: "ziguinchor", lat: 12.5681, lng: -16.2719 },
];
