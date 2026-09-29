export type RegionSeed = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
};

export type RegionPresentation = {
  capital: string;
  description: string;
  // Page d'origine de la description (Wikipédia, licence CC BY-SA 4.0 : attribution obligatoire)
  descriptionSource: string;
  highlights: string[];
};

// Présentation initiale de chaque région. Descriptions : introduction de l'article
// Wikipédia en français (récupérée le 29/09/2026). Elle n'est écrite qu'une seule fois :
// les modifications faites ensuite depuis l'administration ne sont jamais écrasées.
export const regionPresentations: Record<string, RegionPresentation> = {
  dakar: {
    capital: "Dakar",
    description:
      "La Région de Dakar est l'une des 14 régions administratives du Sénégal. Occupant la presqu'île du Cap-Vert, elle correspond au territoire de la capitale, Dakar, et de ses banlieues.",
    descriptionSource: "https://fr.wikipedia.org/wiki/Dakar_(r%C3%A9gion)",
    highlights: [
      "Capitale politique et économique du pays",
      "Port autonome et principal pôle d'affaires",
      "Île de Gorée, inscrite au patrimoine mondial de l'UNESCO",
    ],
  },
  thies: {
    capital: "Thiès",
    description:
      "La région de Thiès est l'une des quatorze régions administratives du Sénégal. Elle est située dans l'ouest du pays, en couronne autour de la presqu'île du Cap-Vert. Le chef-lieu régional est la ville de Thiès.",
    descriptionSource: "https://fr.wikipedia.org/wiki/Thi%C3%A8s_(r%C3%A9gion)",
    highlights: [
      "Carrefour routier et ferroviaire",
      "Tourisme balnéaire de la Petite-Côte",
      "Maraîchage dans la zone des Niayes",
    ],
  },
  diourbel: {
    capital: "Diourbel",
    description:
      "La Région de Diourbel est l'une des 14 régions administratives du Sénégal, située dans l'ouest du pays. Le chef-lieu régional est la ville de Diourbel.",
    descriptionSource: "https://fr.wikipedia.org/wiki/Diourbel_(r%C3%A9gion)",
    highlights: [
      "Touba, ville sainte du mouridisme",
      "Grand Magal, rassemblement religieux majeur",
      "Agriculture du bassin arachidier et artisanat",
    ],
  },
  fatick: {
    capital: "Fatick",
    description:
      "La région de Fatick est l'une des 14 régions administratives du Sénégal. Elle est frontalière avec la Gambie. Le chef-lieu régional est la ville de Fatick. Elle est entourée au nord et au nord-est par les régions de Thiès, Diourbel et Louga, au sud par la République de Gambie, à l’est par la région de Kaolack et à l’ouest par l’océan Atlantique.",
    descriptionSource: "https://fr.wikipedia.org/wiki/Fatick_(r%C3%A9gion)",
    highlights: [
      "Delta du Saloum, inscrit au patrimoine mondial de l'UNESCO",
      "Mangroves, îles et pêche artisanale",
      "Culture et traditions sérères",
    ],
  },
  kaolack: {
    capital: "Kaolack",
    description:
      "La région de Kaolack est l'une des 14 régions administratives du Sénégal. Située dans le centre-ouest du pays, elle est frontalière avec la Gambie, à cheval sur la zone sahélienne Sud et la zone soudanienne Nord. Le chef-lieu régional est la ville de Kaolack.",
    descriptionSource: "https://fr.wikipedia.org/wiki/Kaolack_(r%C3%A9gion)",
    highlights: [
      "Carrefour commercial et routier",
      "Production de sel du Saloum",
      "Cœur du bassin arachidier",
    ],
  },
  kaffrine: {
    capital: "Kaffrine",
    description:
      "Créée en 2008, la région de Kaffrine est l'une des 14 régions administratives du Sénégal. Le chef-lieu régional est la ville de Kaffrine. À la suite des réformes administratives intervenues en 2008, Kaffrine a été nouvellement érigée en région. Elle couvre une superficie de 11.492 km2, soit presque les 2/3 de l’ancienne région de Kaolack avec une population d’environ 600.000 habitants. C’est l’une des cinq plus grandes régions du pays.",
    descriptionSource: "https://fr.wikipedia.org/wiki/Kaffrine_(r%C3%A9gion)",
    highlights: [
      "Région créée en 2008",
      "Agriculture : arachide, mil et maïs",
      "Axe de transit vers l'est du pays",
    ],
  },
  louga: {
    capital: "Louga",
    description:
      "La Région de Louga est l'une des 14 régions administratives du Sénégal. Elle est située au nord-ouest du pays. Le chef-lieu régional est la ville de Louga.",
    descriptionSource: "https://fr.wikipedia.org/wiki/Louga_(r%C3%A9gion)",
    highlights: [
      "Élevage et zone pastorale du Ferlo",
      "Désert de Lompoul",
      "Une diaspora très active",
    ],
  },
  "saint-louis": {
    capital: "Saint-Louis",
    description:
      "La Région de Saint-Louis est l'une des 14 régions administratives du Sénégal, celle située le plus au nord du pays. Le chef-lieu régional est la ville de Saint-Louis.",
    descriptionSource: "https://fr.wikipedia.org/wiki/Saint-Louis_(r%C3%A9gion)",
    highlights: [
      "Île de Saint-Louis, patrimoine mondial de l'UNESCO",
      "Vallée du fleuve Sénégal et agriculture irriguée",
      "Parc national des oiseaux du Djoudj",
    ],
  },
  matam: {
    capital: "Matam",
    description:
      "La Région de Matam est l'une des 14 régions administratives du Sénégal. Le chef-lieu régional est la ville de Matam.",
    descriptionSource: "https://fr.wikipedia.org/wiki/Matam_(r%C3%A9gion)",
    highlights: [
      "Vallée du fleuve et cultures de décrue",
      "Élevage",
      "Une diaspora très active",
    ],
  },
  tambacounda: {
    capital: "Tambacounda",
    description:
      "La région de Tambacounda est l'une des 14 régions administratives du Sénégal. Très étendue, elle est située dans l'est du pays. Le chef-lieu régional est la ville de Tambacounda. Tambacounda est géographiquement la plus grande des 11 régions du Sénégal, mais a une faible densité de population, son économie est plus pauvre que celle du reste du pays.",
    descriptionSource: "https://fr.wikipedia.org/wiki/Tambacounda_(r%C3%A9gion)",
    highlights: [
      "Plus grande région du pays",
      "Parc national du Niokolo-Koba, patrimoine mondial de l'UNESCO",
      "Carrefour vers le Mali et la Guinée",
    ],
  },
  kedougou: {
    capital: "Kédougou",
    description:
      "La région de Kédougou est l'une des 14 régions administratives du Sénégal. Frontalière avec le Mali et la Guinée, elle est située dans l'extrême sud-est du pays. Le chef-lieu régional est la ville de Kédougou.",
    descriptionSource: "https://fr.wikipedia.org/wiki/K%C3%A9dougou_(r%C3%A9gion)",
    highlights: [
      "Collines et cascade de Dindéfélo",
      "Pays bassari, inscrit au patrimoine mondial de l'UNESCO",
      "Ressources minières, notamment l'or",
    ],
  },
  kolda: {
    capital: "Kolda",
    description:
      "La région de Kolda est l'une des 14 régions administratives du Sénégal. Elle est située en Haute-Casamance, dans le sud du pays. Elle est bordée au nord par la Gambie, au sud par la Guinée-Bissau et la Guinée, à l'Ouest par la région de Sédhiou et à l'Est par la région de Tambacounda. Le chef-lieu régional est la ville de Kolda.",
    descriptionSource: "https://fr.wikipedia.org/wiki/Kolda_(r%C3%A9gion)",
    highlights: [
      "Haute-Casamance",
      "Agriculture : coton, riz et arachide",
      "Élevage",
    ],
  },
  sedhiou: {
    capital: "Sédhiou",
    description:
      "La région de Sédhiou est l'une des 14 régions administratives du Sénégal. Elle est située au centre de la Casamance, ou Moyenne Casamance. Elle fait partie des dernières régions créées, en 2008. Le chef-lieu régional est la ville de Sédhiou.",
    descriptionSource: "https://fr.wikipedia.org/wiki/S%C3%A9dhiou_(r%C3%A9gion)",
    highlights: [
      "Région créée en 2008",
      "Fleuve Casamance",
      "Riziculture et anacarde",
    ],
  },
  ziguinchor: {
    capital: "Ziguinchor",
    description:
      "La région de Ziguinchor est l'une des 14 régions administratives du Sénégal. Frontalière avec la Gambie au nord et la Guinée-Bissau au sud, elle forme la partie occidentale de la Casamance, connue sous le nom de Basse Casamance. Les communications avec Dakar passent presque exclusivement par mer ou à travers le territoire de la Gambie.",
    descriptionSource: "https://fr.wikipedia.org/wiki/Ziguinchor_(r%C3%A9gion)",
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
