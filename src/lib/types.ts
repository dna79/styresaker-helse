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
export type Klassifisering = "Endre" | "FaseUt" | "UtvikleNytt" | "IkkeVurdert";

export interface Kapabilitet {
  id: string;
  navn: string;
  verdistrøm: Verdistrøm;
  teamtype: Teamtype;
  prosesstype: Prosesstype;
  eierskap: Eierskap;
  it4itKomponent?: string;
  modenhetNå: number;
  modenhetMål: number;
  kritikalitet: Kritikalitet;
  klassifisering: Klassifisering;
  notater: string;
}

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
  "Tverrgående": "Cross-cutting",
};

export const MODENHET_LABELS: Record<number, string> = {
  0: "Ikke vurdert",
  1: "Ad hoc / Initial",
  2: "Delvis definert",
  3: "Definert og dokumentert",
  4: "Styrt og målt",
  5: "Optimalisert",
};

export const KLASSIFISERING_LABELS: Record<Klassifisering, string> = {
  Endre: "Endre",
  FaseUt: "Fase ut",
  UtvikleNytt: "Utvikle nytt",
  IkkeVurdert: "Ikke vurdert",
};
