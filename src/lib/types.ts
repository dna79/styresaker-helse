// ─── Enums ───────────────────────────────────────────────────────────────────

export type Verdistrøm =
  | "Evaluere produkter"
  | "Utforske produkter"
  | "Utvikle nye produkter"
  | "Produksjonssette produkter"
  | "Tilgjengeliggjøre produkter"
  | "Bruke produkter"
  | "Drifte produkter"
  | "Tverrgående";

export type Teamtype = "Produktområde" | "Plattformteam" | "Støtteteam";
export type Prosesstype = "Kjerne" | "Styring" | "Støtte";
export type Eierskap = "Kjerne" | "Produkt";
export type Kritikalitet = "Høy" | "Middels" | "Lav";
export type Klassifisering = "Endre" | "FaseUt" | "UtvikleNytt" | "Behold" | "IkkeVurdert";
export type ModenhetScore = 0 | 1 | 2 | 3 | 4 | 5;

// ─── Domenetype ──────────────────────────────────────────────────────────────

export type DomeneId =
  | "leveransedyktighet"
  | "plattform-infrastruktur"
  | "data-integrasjon"
  | "kunde-tjenestestyring"
  | "sikkerhet-risiko"
  | "styring-portefolje"
  | "kompetanse-organisasjon";

export interface Domene {
  id: DomeneId;
  navn: string;
  beskrivelse: string;
  ikon: string;
  farge: string; // Tailwind color class base (e.g. "violet")
}

// ─── Realisering (nivå 3) ─────────────────────────────────────────────────────

export interface ProsessReferanseStrukturert {
  prosesstype?: string;
  prosessnavn?: string;
  underprosess?: string;
}

export interface IT4ITFunksjonellKomponent {
  navn: string;
  verdistrøm?: string;
}

export interface Realisering {
  prosessReferanse?: string;
  prosessreferanse?: ProsessReferanseStrukturert;
  it4itKomponent?: string;
  it4itFunksjonellKomponent?: IT4ITFunksjonellKomponent;
  verktøy?: string[];
  kompetansekrav?: string[];
  avhengigheter?: string[];
  gapÅrsak?: string;
}

// ─── Gartner teknisk referansearkitektur ─────────────────────────────────────

export interface GartnerKategori {
  domene: string;
  kategori: string;
  subkategori?: string;
}

// ─── Kapabilitet (nivå 2 — det som scores) ────────────────────────────────────

export interface Kapabilitet {
  id: string;
  navn: string;
  beskrivelse?: string;

  // Klassifisering
  domeneId: DomeneId;
  verdistrøm: Verdistrøm;
  teamtype: Teamtype;
  prosesstype: Prosesstype;
  eierskap: Eierskap;
  kritikalitet: Kritikalitet;

  // Scoring
  modenhetNå: ModenhetScore;
  modenhetMål: ModenhetScore;

  // Beslutning
  klassifisering: Klassifisering;
  prioritet?: number; // 1 = høyest

  // Realisering (nivå 3)
  realisering: Realisering;

  // Gartner teknisk referansearkitektur
  gartnerKategori?: GartnerKategori;

  // Workspace
  notater: string;
  workshopDato?: string;
  ansvarlig?: string;
}

// ─── Dimensjon ────────────────────────────────────────────────────────────────

export type Dimensjon = "kjerne" | "produkt" | "digitalt";

// ─── Produktverdistrøm ────────────────────────────────────────────────────────

export type ProduktVerdistrøm =
  | "Prehospital"
  | "Poliklinisk behandling"
  | "Innleggelse og akuttmottak"
  | "Operasjon og prosedyre"
  | "Utskrivelse og oppfølging"
  | "Digital hjemmeoppfølging"
  | "Samhandling"
  | "HR og kompetansestyring"
  | "Økonomi og logistikk"
  | "Forskning og innovasjon";

export const PRODUKT_VERDISTRØMMER: { id: ProduktVerdistrøm; ikon: string; kategori: "Klinisk" | "Administrativ" }[] = [
  { id: "Prehospital",                 ikon: "🚑", kategori: "Klinisk" },
  { id: "Poliklinisk behandling",      ikon: "🩺", kategori: "Klinisk" },
  { id: "Innleggelse og akuttmottak",  ikon: "🛏️", kategori: "Klinisk" },
  { id: "Operasjon og prosedyre",      ikon: "✂️", kategori: "Klinisk" },
  { id: "Utskrivelse og oppfølging",   ikon: "🏠", kategori: "Klinisk" },
  { id: "Digital hjemmeoppfølging",    ikon: "📱", kategori: "Klinisk" },
  { id: "Samhandling",                 ikon: "🤝", kategori: "Klinisk" },
  { id: "HR og kompetansestyring",     ikon: "👥", kategori: "Administrativ" },
  { id: "Økonomi og logistikk",        ikon: "📦", kategori: "Administrativ" },
  { id: "Forskning og innovasjon",     ikon: "🔬", kategori: "Administrativ" },
];

// ─── Produktkapabilitet ───────────────────────────────────────────────────────

export interface Produktkapabilitet {
  id: string;
  navn: string;
  beskrivelse: string;
  verdistrøm: ProduktVerdistrøm;
  domeneId: string;
  kritikalitet: Kritikalitet;
  modenhetNå: number;
  modenhetMål: number;
  notater: string;
  spRolle: "Kartlegge" | "Pådriver" | "Støtte" | "IkkeVurdert";
}

// ─── Digitalt produkt (IT4IT Digital Product — koblingslaget) ─────────────────

export type ProduktOmråde =
  | "Administrative produkter"
  | "Kliniske produkter"
  | "IKT-Produkter"
  | "Produkter for bruker og datadrevet utvikling";

export type ProduktStatus = "Idé" | "Under utvikling" | "I produksjon" | "Avviklet";

export interface DigitaltProdukt {
  id: string;
  navn: string;
  beskrivelse: string;
  produktområde: ProduktOmråde;
  produktkapabilitetIder: string[];
  kjernekapabilitetIder: string[];
  status: ProduktStatus;
  notater: string;
}

// ─── Konstanter ───────────────────────────────────────────────────────────────

export const VERDISTRØMMER: Verdistrøm[] = [
  "Evaluere produkter",
  "Utforske produkter",
  "Utvikle nye produkter",
  "Produksjonssette produkter",
  "Tilgjengeliggjøre produkter",
  "Bruke produkter",
  "Drifte produkter",
  "Tverrgående",
];

export const IT4IT_MAP: Record<Verdistrøm, string> = {
  "Evaluere produkter": "Evaluate",
  "Utforske produkter": "Explore",
  "Utvikle nye produkter": "Integrate",
  "Produksjonssette produkter": "Release",
  "Tilgjengeliggjøre produkter": "Deploy",
  "Bruke produkter": "Consume",
  "Drifte produkter": "Operate",
  "Tverrgående": "Supporting",
};

export const MODENHET_LABELS: Record<ModenhetScore, string> = {
  0: "Ikke vurdert",
  1: "Ad hoc / Initial",
  2: "Delvis definert",
  3: "Definert og dokumentert",
  4: "Styrt og målt",
  5: "Optimalisert",
};

export const MODENHET_SHORT: Record<ModenhetScore, string> = {
  0: "—",
  1: "Ad hoc",
  2: "Delvis",
  3: "Definert",
  4: "Styrt",
  5: "Optimalisert",
};

export const KLASSIFISERING_LABELS: Record<Klassifisering, string> = {
  Behold: "Behold",
  Endre: "Endre",
  FaseUt: "Fase ut",
  UtvikleNytt: "Utvikle nytt",
  IkkeVurdert: "Ikke vurdert",
};

export const DOMENER: Domene[] = [
  {
    id: "leveransedyktighet",
    navn: "Leveransedyktighet",
    beskrivelse: "Evne til å planlegge, utvikle og levere produkter og tjenester effektivt",
    ikon: "🚀",
    farge: "violet",
  },
  {
    id: "plattform-infrastruktur",
    navn: "Plattform og infrastruktur",
    beskrivelse: "Evne til å bygge, drifte og skalere teknisk fundament og sky-tjenester",
    ikon: "⚙️",
    farge: "cyan",
  },
  {
    id: "data-integrasjon",
    navn: "Data og integrasjon",
    beskrivelse: "Evne til å forvalte, dele og utnytte data og integrasjoner på tvers",
    ikon: "🔗",
    farge: "blue",
  },
  {
    id: "kunde-tjenestestyring",
    navn: "Kunde og tjenestestyring",
    beskrivelse: "Evne til å levere, støtte og forbedre tjenester for sluttbrukere og kunder",
    ikon: "🤝",
    farge: "orange",
  },
  {
    id: "sikkerhet-risiko",
    navn: "Sikkerhet og risiko",
    beskrivelse: "Evne til å beskytte, overvåke og håndtere risiko på tvers av virksomheten",
    ikon: "🛡️",
    farge: "red",
  },
  {
    id: "styring-portefolje",
    navn: "Styring og portefølje",
    beskrivelse: "Evne til å styre strategi, portefølje, økonomi og regulatorisk etterlevelse",
    ikon: "📊",
    farge: "emerald",
  },
  {
    id: "kompetanse-organisasjon",
    navn: "Kompetanse og organisasjon",
    beskrivelse: "Evne til å bygge og utvikle kompetanse, kultur og organisatorisk kapasitet",
    ikon: "🧠",
    farge: "amber",
  },
];
