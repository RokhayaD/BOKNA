export type RegionSeed = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
};

export type RegionPresentation = {
  capital: string;
  description: string;
  highlights: string[];
};

// Présentation initiale de chaque région. Elle n'est écrite qu'une seule fois :
// les modifications faites ensuite depuis l'administration ne sont jamais écrasées.
export const regionPresentations: Record<string, RegionPresentation> = {
  dakar: {
    capital: "Dakar",
    description:
      "Capitale du Sénégal, la région de Dakar occupe la presqu'île du Cap-Vert, point le plus occidental du continent africain. Plus petite région du pays par la superficie, elle concentre une grande partie de la population urbaine, des institutions et de l'activité économique nationale.",
    highlights: [
      "Capitale politique et économique du pays",
      "Port autonome et principal pôle d'affaires",
      "Île de Gorée, inscrite au patrimoine mondial de l'UNESCO",
    ],
  },
  thies: {
    capital: "Thiès",
    description:
      "Située aux portes de Dakar, la région de Thiès allie carrefour ferroviaire historique, agriculture maraîchère et tourisme balnéaire sur la Petite-Côte.",
    highlights: [
      "Carrefour routier et ferroviaire",
      "Tourisme balnéaire de la Petite-Côte",
      "Maraîchage dans la zone des Niayes",
    ],
  },
  diourbel: {
    capital: "Diourbel",
    description:
      "Au cœur du bassin arachidier, la région de Diourbel abrite la ville sainte de Touba, haut lieu du mouridisme qui accueille chaque année le Grand Magal.",
    highlights: [
      "Touba, ville sainte du mouridisme",
      "Grand Magal, rassemblement religieux majeur",
      "Agriculture du bassin arachidier et artisanat",
    ],
  },
  fatick: {
    capital: "Fatick",
    description:
      "Terre du Sine et du Saloum, la région de Fatick est marquée par le delta du Saloum, ses mangroves et ses îles, ainsi que par une forte tradition agricole et culturelle sérère.",
    highlights: [
      "Delta du Saloum, inscrit au patrimoine mondial de l'UNESCO",
      "Mangroves, îles et pêche artisanale",
      "Culture et traditions sérères",
    ],
  },
  kaolack: {
    capital: "Kaolack",
    description:
      "Grand carrefour commercial du centre du pays, la région de Kaolack est un pôle du bassin arachidier et de la production de sel, réputée pour son grand marché central.",
    highlights: [
      "Carrefour commercial et routier",
      "Production de sel du Saloum",
      "Cœur du bassin arachidier",
    ],
  },
  kaffrine: {
    capital: "Kaffrine",
    description:
      "Créée en 2008, la région de Kaffrine est une terre agricole du bassin arachidier, traversée par l'axe routier qui relie l'ouest et l'est du pays.",
    highlights: [
      "Région créée en 2008",
      "Agriculture : arachide, mil et maïs",
      "Axe de transit vers l'est du pays",
    ],
  },
  louga: {
    capital: "Louga",
    description:
      "Au nord-ouest du pays, la région de Louga s'étend du littoral aux zones pastorales du Ferlo. Elle est connue pour l'élevage, le commerce et le dynamisme de sa diaspora.",
    highlights: [
      "Élevage et zone pastorale du Ferlo",
      "Désert de Lompoul",
      "Une diaspora très active",
    ],
  },
  "saint-louis": {
    capital: "Saint-Louis",
    description:
      "Ancienne capitale du Sénégal et de l'Afrique-Occidentale française, Saint-Louis est bâtie à l'embouchure du fleuve Sénégal. Son île historique est inscrite au patrimoine mondial de l'UNESCO.",
    highlights: [
      "Île de Saint-Louis, patrimoine mondial de l'UNESCO",
      "Vallée du fleuve Sénégal et agriculture irriguée",
      "Parc national des oiseaux du Djoudj",
    ],
  },
  matam: {
    capital: "Matam",
    description:
      "Dans la vallée du fleuve Sénégal, au cœur du Fouta, la région de Matam vit de l'agriculture de décrue, de l'élevage et des transferts de sa diaspora.",
    highlights: [
      "Vallée du fleuve et cultures de décrue",
      "Élevage",
      "Une diaspora très active",
    ],
  },
  tambacounda: {
    capital: "Tambacounda",
    description:
      "Plus vaste région du Sénégal, Tambacounda est un carrefour vers le Mali et la Guinée. Elle abrite une grande partie du parc national du Niokolo-Koba.",
    highlights: [
      "Plus grande région du pays",
      "Parc national du Niokolo-Koba, patrimoine mondial de l'UNESCO",
      "Carrefour vers le Mali et la Guinée",
    ],
  },
  kedougou: {
    capital: "Kédougou",
    description:
      "À l'extrême sud-est du pays, la région de Kédougou offre les principaux reliefs du Sénégal, des cascades et une grande richesse culturelle. Elle est aussi un pôle d'exploitation aurifère.",
    highlights: [
      "Collines et cascade de Dindéfélo",
      "Pays bassari, inscrit au patrimoine mondial de l'UNESCO",
      "Ressources minières, notamment l'or",
    ],
  },
  kolda: {
    capital: "Kolda",
    description:
      "Au cœur de la Haute-Casamance, la région de Kolda est une zone d'agriculture et d'élevage, frontalière de la Gambie et de la Guinée-Bissau.",
    highlights: [
      "Haute-Casamance",
      "Agriculture : coton, riz et arachide",
      "Élevage",
    ],
  },
  sedhiou: {
    capital: "Sédhiou",
    description:
      "Créée en 2008 en Moyenne-Casamance, la région de Sédhiou est traversée par le fleuve Casamance. Son économie repose sur l'agriculture, notamment la riziculture et l'anacarde.",
    highlights: [
      "Région créée en 2008",
      "Fleuve Casamance",
      "Riziculture et anacarde",
    ],
  },
  ziguinchor: {
    capital: "Ziguinchor",
    description:
      "Capitale de la Basse-Casamance, la région de Ziguinchor est réputée pour ses paysages verdoyants, ses rizières, ses bolongs et les plages du Cap Skirring.",
    highlights: [
      "Basse-Casamance et fleuve Casamance",
      "Tourisme : Cap Skirring et îles",
      "Riziculture et culture diola",
    ],
  },
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
