export type ProsessType = "Kjerne" | "Styring" | "Støtte";
export type Dekning = "✓" | "~" | "⚠";

export interface ProsessRad {
  type: ProsessType;
  navn: string;
  verdistrømmer: string[];
  funksjonelleGrupper: string[];
  undernivåer: string[];
  dekning: Dekning;
  merknad: string;
}

export const IT4IT_VERDISTRØMMER = [
  "Evaluere produkter",
  "Utforske produkter",
  "Utvikle nye produkter",
  "Produksjonssette produkter",
  "Tilgjengeliggjøre produkter",
  "Bruke produkter",
  "Drifte produkter",
  "Tverrgående",
] as const;

export const IT4IT_FUNKSJONELLE_GRUPPER = [
  "Strategy", "Portfolio", "Develop", "Test", "Fulfill", "Consume", "Support", "Assure",
] as const;

export const PROSESS_RADER: ProsessRad[] = [
  // ── Kjerneprosesser ──────────────────────────────────────────────────────
  {
    type: "Kjerne", navn: "Marked og kundeledelse — Forstå markedet",
    verdistrømmer: ["Evaluere produkter", "Utforske produkter"], funksjonelleGrupper: ["Strategy"],
    undernivåer: ["Forstå leverandørmarkedet", "Forstå konkurrentene", "Forstå kunden og kundens behov", "Forstå teknologi-trender"],
    dekning: "✓", merknad: "God dekning mot IT4IT Strategy-gruppen (Policy, Architecture). Bidrar til kapabilitet Portefølje- og strategistyring og Kapabilitetskartlegging.",
  },
  {
    type: "Kjerne", navn: "Marked og kundeledelse — Strategisk kundeutvikling",
    verdistrømmer: ["Evaluere produkter"], funksjonelleGrupper: ["Strategy", "Portfolio"],
    undernivåer: ["Kundesegmentering"],
    dekning: "~", merknad: "SP-spesifikk funksjon uten direkte IT4IT-analog. Nærmest Strategy (Proposal) + Portfolio (Digital Product). Understøtter kapabilitet Portefølje- og strategistyring.",
  },
  {
    type: "Kjerne", navn: "Produktledelse og produktutvikling — Produktledelse",
    verdistrømmer: ["Evaluere produkter", "Utforske produkter"], funksjonelleGrupper: ["Strategy", "Portfolio"],
    undernivåer: ["Strategisk innsikt", "Evaluere portefølje", "Utvikle Produktplanverk (PPV)", "Vurdere behov", "Livsløpsstyring"],
    dekning: "✓", merknad: "Kjernen i IT4IT Portfolio-gruppen (Digital Product, Portfolio Backlog). Realiserer kapabilitetene Portefølje- og strategistyring, Investeringsstyring og Gevinstrealisering.",
  },
  {
    type: "Kjerne", navn: "Produktledelse og produktutvikling — Tilrettelegge for innovasjon",
    verdistrømmer: ["Utforske produkter"], funksjonelleGrupper: ["Strategy"],
    undernivåer: ["Kundedrevet innovasjon", "Lede innovasjonsarbeid"],
    dekning: "~", merknad: "IT4IT dekker ikke innovasjonsprosessen eksplisitt. Nærmest Strategy-gruppen (Proposal). Realiserer kapabilitet Innovasjonsledelse og eksperimentering.",
  },
  {
    type: "Kjerne", navn: "Produktledelse og produktutvikling — Forstå og avstemme behov",
    verdistrømmer: ["Utforske produkter"], funksjonelleGrupper: ["Develop"],
    undernivåer: ["Kartlegge behov"],
    dekning: "✓", merknad: "Tilsvarer IT4IT Develop-gruppen (Requirement). Realiserer kapabilitetene Krav- og behovsstyring og Tjenestedesign og UX.",
  },
  {
    type: "Kjerne", navn: "Produktledelse og produktutvikling — Utvikle produkt- og/eller tjenestekonsept",
    verdistrømmer: ["Utforske produkter"], funksjonelleGrupper: ["Develop", "Portfolio"],
    undernivåer: ["Verifisere XaaS-muligheter", "Avklare samarbeid", "Utvikle løsningsforslag", "Prototype løsning", "Evaluere løsning", "Identifisere gevinst/verdi"],
    dekning: "✓", merknad: "Develop (Requirement, Product Backlog) + Portfolio (Digital Product). Realiserer Tjenestedesign og UX og Krav- og behovsstyring.",
  },
  {
    type: "Kjerne", navn: "Produktledelse og produktutvikling — Utarbeide verdiforslag",
    verdistrømmer: ["Evaluere produkter"], funksjonelleGrupper: ["Portfolio", "Strategy"],
    undernivåer: ["Beskrive løsning (konsept)", "Estimere etablering", "Estimere drift/produksjon", "Vurdere sanering", "Ferdigstille businesscase", "Verifisere verdiforslag"],
    dekning: "✓", merknad: "Portfolio (Cost Model, Resource) + Strategy (Proposal). Realiserer kapabilitet Investeringsstyring og business case.",
  },
  {
    type: "Kjerne", navn: "Salg og kundebetjening — Identifisere salgsmuligheter",
    verdistrømmer: ["Evaluere produkter", "Utforske produkter"], funksjonelleGrupper: ["Strategy", "Portfolio"],
    undernivåer: ["3 innganger i salg"],
    dekning: "~", merknad: "SP-spesifikk B2B-prosess (SP selger til helseforetak). Nærmest Strategy (Proposal). Ingen direkte IT4IT-analog for salgsfasen.",
  },
  {
    type: "Kjerne", navn: "Salg og kundebetjening — Utarbeide tilbud/leveranseavtale",
    verdistrømmer: ["Evaluere produkter"], funksjonelleGrupper: ["Strategy", "Consume"],
    undernivåer: ["Godkjenne tilbud"],
    dekning: "~", merknad: "Strategy (Proposal) + Consume (Service Offer Catalog, Subscription). Realiserer kapabilitet Avtale- og SLA-styring.",
  },
  {
    type: "Kjerne", navn: "Salg og kundebetjening — Ta imot bestilling og overlevere",
    verdistrømmer: ["Bruke produkter"], funksjonelleGrupper: ["Consume"],
    undernivåer: ["Overlevere til leveranse"],
    dekning: "✓", merknad: "Consume-gruppen (Subscription, Consumption Experience). Realiserer Tjenestekatalog og bestillingsflyt.",
  },
  {
    type: "Kjerne", navn: "Salg og kundebetjening — Utvikle og vedlikeholde kundeplaner",
    verdistrømmer: ["Evaluere produkter"], funksjonelleGrupper: ["Strategy"],
    undernivåer: ["Oppfølging av tjenesteproduksjon og leveranse"],
    dekning: "~", merknad: "Ingen direkte IT4IT-analog. Strategy-gruppen dekker delvis. Bidrar til kapabilitet Avtale- og SLA-styring.",
  },
  {
    type: "Kjerne", navn: "Leveranse — Ressursstyring",
    verdistrømmer: ["Utvikle nye produkter"], funksjonelleGrupper: ["Portfolio"],
    undernivåer: ["Innleie på konsulent- og vikarrammeavtaler"],
    dekning: "✓", merknad: "Portfolio-gruppen (Resource). Realiserer kapabilitet Ressursplanlegging og kapasitetsforvaltning.",
  },
  {
    type: "Kjerne", navn: "Leveranse — Planlegge og forberede",
    verdistrømmer: ["Utvikle nye produkter"], funksjonelleGrupper: ["Develop", "Portfolio"],
    undernivåer: ["Planlegge gevinster, realisering og endringsbehov", "Utarbeide aktivitetsplan", "Verifisere arbeidsform, team og kapasitet"],
    dekning: "✓", merknad: "Develop (Product Backlog, Collaboration) + Portfolio (Resource). Realiserer Produktteam-evne og agil leveranse.",
  },
  {
    type: "Kjerne", navn: "Leveranse — Lede gjennomføringen",
    verdistrømmer: ["Utvikle nye produkter"], funksjonelleGrupper: ["Develop"],
    undernivåer: ["Bestille/anskaffe varer, tjenester og ressurser", "Utvikle og bygge"],
    dekning: "✓", merknad: "Develop-gruppen (Build, Source Code, Pipeline, Collaboration). Realiserer CI/CD og DevSecOps og Produktteam-evne.",
  },
  {
    type: "Kjerne", navn: "Leveranse — Test",
    verdistrømmer: ["Utvikle nye produkter"], funksjonelleGrupper: ["Test"],
    undernivåer: ["Bistand under anskaffelse", "Planlegging og design av testgjennomføring", "Forberedelse av testaktiviteter", "Testgjennomføring", "Rapportering og evaluering", "Avslutning"],
    dekning: "✓", merknad: "Test-gruppen (Test, Defect). Realiserer kapabilitet Testautomatisering og kvalitetssikring.",
  },
  {
    type: "Kjerne", navn: "Leveranse — Deploy",
    verdistrømmer: ["Tilgjengeliggjøre produkter"], funksjonelleGrupper: ["Fulfill"],
    undernivåer: [],
    dekning: "✓", merknad: "Fulfill-gruppen (Deployment). Realiserer kapabilitet Infrastruktur- og skyplattformstyring og Infrastructure as Code.",
  },
  {
    type: "Kjerne", navn: "Leveranse — Release",
    verdistrømmer: ["Produksjonssette produkter"], funksjonelleGrupper: ["Fulfill"],
    undernivåer: ["RM_Release_Agile", "RM_Release_New", "Release_Existing", "ITSM_Release_RAB"],
    dekning: "✓", merknad: "Fulfill-gruppen (Release Composition, Change). Realiserer kapabilitet Release- og pakkestyring.",
  },
  {
    type: "Kjerne", navn: "Leveranse — Change Enablement",
    verdistrømmer: ["Produksjonssette produkter"], funksjonelleGrupper: ["Fulfill"],
    undernivåer: ["Standard Change", "Emergency Change", "Normal Change", "DevOps Change"],
    dekning: "✓", merknad: "Fulfill-gruppen (Change). Realiserer kapabilitet Endringsstyring (Change Management).",
  },
  {
    type: "Kjerne", navn: "Leveranse — Tilgangsstyring",
    verdistrømmer: ["Tilgjengeliggjøre produkter"], funksjonelleGrupper: ["Fulfill"],
    undernivåer: ["Access Management"],
    dekning: "✓", merknad: "Fulfill-gruppen (Identity). Realiserer kapabilitet Identitets- og tilgangsstyring (IAM).",
  },
  {
    type: "Kjerne", navn: "Leveranse — Gjennomføre gevinst- og endringsarbeid",
    verdistrømmer: ["Produksjonssette produkter"], funksjonelleGrupper: ["Portfolio"],
    undernivåer: ["Oppdatere masterdata og dokumentasjon", "Overlevere", "Avslutte økonomi"],
    dekning: "✓", merknad: "Portfolio (Resource, Cost Model). Realiserer kapabilitet Gevinstrealisering.",
  },
  {
    type: "Kjerne", navn: "Leveranse — Testmiljø",
    verdistrømmer: ["Utvikle nye produkter"], funksjonelleGrupper: ["Test", "Develop"],
    undernivåer: [],
    dekning: "~", merknad: "Test-gruppen + Develop (Pipeline). Understøttes teknisk av kapabilitet Infrastruktur- og skyplattformstyring.",
  },
  {
    type: "Kjerne", navn: "Tjenesteproduksjon — Vedlikeholde",
    verdistrømmer: ["Drifte produkter"], funksjonelleGrupper: ["Assure"],
    undernivåer: ["Versjonshåndtering", "Sårbarhetsoppdateringer", "Konfigurasjon og kodeverk"],
    dekning: "✓", merknad: "Assure-gruppen (Configuration, Runbook). Realiserer kapabilitet Konfigurasjonsstyring og CMDB.",
  },
  {
    type: "Kjerne", navn: "Tjenesteproduksjon — Kapasitets- og ytelseshåndtering",
    verdistrømmer: ["Drifte produkter"], funksjonelleGrupper: ["Assure"],
    undernivåer: [],
    dekning: "✓", merknad: "Assure-gruppen (Service Monitor, Event). Realiserer kapabilitet Kapasitetsstyring og skalering og Overvåkning og ytelsesstyring.",
  },
  {
    type: "Kjerne", navn: "Tjenesteproduksjon — Kunnskapshåndtering",
    verdistrømmer: ["Bruke produkter", "Drifte produkter"], funksjonelleGrupper: ["Support"],
    undernivåer: ["Revidere Knowledge", "Lag ny Knowledge"],
    dekning: "✓", merknad: "Support-gruppen (Knowledge). Understøttes av kapabilitet Bruker- og kundesupport (servicedesk).",
  },
  {
    type: "Kjerne", navn: "Tjenesteproduksjon — Oppdage og rette",
    verdistrømmer: ["Drifte produkter"], funksjonelleGrupper: ["Support", "Assure"],
    undernivåer: ["Overvåke, måle og analysere", "Hendelseshåndtering (Incident / Major Incident)", "Problemløsning (Problem)"],
    dekning: "✓", merknad: "Support (Incident, Request) + Assure (Problem, Event). Realiserer kapabilitet Hendelses- og problemhåndtering.",
  },
  {
    type: "Kjerne", navn: "Tjenesteproduksjon — IT-eiendels- og konfigurasjonsstyring",
    verdistrømmer: ["Drifte produkter"], funksjonelleGrupper: ["Assure"],
    undernivåer: ["Eiendelsstyring", "Konfigurasjonsstyring", "Katalogstyring"],
    dekning: "✓", merknad: "Assure-gruppen (Configuration). Realiserer kapabilitet Konfigurasjonsstyring og CMDB.",
  },
  {
    type: "Kjerne", navn: "Tjenesteproduksjon — Standardiserte leveranser",
    verdistrømmer: ["Bruke produkter"], funksjonelleGrupper: ["Consume", "Support"],
    undernivåer: ["Produktkatalog og Bestillingskatalog", "Tjenesteforespørselsstyring (Request Management)"],
    dekning: "✓", merknad: "Consume (Service Offer Catalog, Subscription) + Support (Request). Realiserer kapabilitet Tjenestekatalog og bestillingsflyt og Standardiserte katalogtjenester.",
  },
  {
    type: "Kjerne", navn: "Tjenesteproduksjon — Brukerstøtte",
    verdistrømmer: ["Bruke produkter"], funksjonelleGrupper: ["Support"],
    undernivåer: [],
    dekning: "✓", merknad: "Support-gruppen (Incident, Request, Knowledge). Realiserer kapabilitet Bruker- og kundesupport (servicedesk).",
  },

  // ── Styringsprosesser ────────────────────────────────────────────────────
  {
    type: "Styring", navn: "Strategi — Strategiutvikling",
    verdistrømmer: ["Evaluere produkter", "Tverrgående"], funksjonelleGrupper: ["Strategy"],
    undernivåer: ["Analyse og diagnose", "Strategiske valg", "Strategiske planer"],
    dekning: "✓", merknad: "Strategy-gruppen (Policy, Architecture). Realiserer kapabilitet Portefølje- og strategistyring og Virksomhetsarkitektur og metodestyring.",
  },
  {
    type: "Styring", navn: "Strategi — Strategiimplementering",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["Strategy", "Portfolio"],
    undernivåer: ["Struktur, system og prosess", "Evaluering og læring"],
    dekning: "~", merknad: "Strategy + Portfolio (Portfolio Backlog). Realiserer kapabilitet Kontinuerlig forbedring (CSIP) og Kulturbygging og endringsevne.",
  },
  {
    type: "Styring", navn: "Økonomi- og virksomhetsstyring",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["Portfolio"],
    undernivåer: ["Styre- og eierdialog", "Økonomisk planlegging og styring (ØLP, Budsjett, Tjenesteprismodell)", "Periodisk oppfølging og rapportering", "Resultatstyring"],
    dekning: "✓", merknad: "Portfolio-gruppen (Cost Model). Realiserer kapabilitet Investeringsstyring og business case.",
  },
  {
    type: "Styring", navn: "Styringsstruktur og etterlevelse",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["Strategy"],
    undernivåer: ["Forbedre og vedlikeholde ledelsessystemet", "Ivareta bærekraft", "Utøve internkontroll", "Melde og håndtere avvik", "Følge opp samsvar", "Planlegge og gjennomføre revisjoner"],
    dekning: "✓", merknad: "Strategy-gruppen (Policy). Realiserer kapabilitet Regulatorisk etterlevelse og rammestyring og Sikkerhetsstyring (ISMS).",
  },
  {
    type: "Styring", navn: "Strategisk HRM",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["Strategy"],
    undernivåer: ["Strategisk tilpasning til overordnet strategi og mål", "Tiltrekke og beholde talenter", "Kompetanse og karriereutvikling", "Ledelse og kultur", "Arbeidsmiljø"],
    dekning: "~", merknad: "IT4IT dekker ikke HR eksplisitt. Nærmest Strategy-gruppen (Policy). Realiserer kapabilitet Kompetanseutvikling og talentstyring og Kulturbygging og endringsevne.",
  },
  {
    type: "Styring", navn: "Porteføljestyring — Definere porteføljen",
    verdistrømmer: ["Evaluere produkter"], funksjonelleGrupper: ["Portfolio", "Strategy"],
    undernivåer: ["Forstå", "Kategorisere", "Prioritere", "Balansere", "Planlegge"],
    dekning: "✓", merknad: "Portfolio-gruppen (Digital Product, Portfolio Backlog, Resource, Cost Model). Realiserer kapabilitet Portefølje- og strategistyring.",
  },
  {
    type: "Styring", navn: "Porteføljestyring — Levere porteføljen",
    verdistrømmer: ["Evaluere produkter", "Tverrgående"], funksjonelleGrupper: ["Portfolio"],
    undernivåer: ["Styringsstruktur", "Økonomistyring", "Gevinst- og endringsarbeid", "Risikostyring", "Ressursstyring", "Oppfølging og kontroll", "Interessenthåndtering"],
    dekning: "✓", merknad: "Portfolio (Resource, Cost Model). Realiserer kapabilitet Portefølje- og strategistyring og Gevinstrealisering.",
  },
  {
    type: "Styring", navn: "Risikostyring",
    verdistrømmer: ["Tverrgående", "Drifte produkter"], funksjonelleGrupper: ["Assure", "Strategy"],
    undernivåer: [],
    dekning: "~", merknad: "Assure-gruppen (Service Contract) + Strategy (Policy). Realiserer kapabilitet Risikostyring og personvern (GDPR). IT4IT har begrenset normativ dekning av risikostyring utover IT-drift.",
  },
  {
    type: "Styring", navn: "Sikkerhetsstyring",
    verdistrømmer: ["Tverrgående", "Drifte produkter"], funksjonelleGrupper: ["Assure", "Strategy"],
    undernivåer: [],
    dekning: "~", merknad: "Assure (Service Monitor, Event) + Strategy (Policy). Realiserer kapabilitetene Sikkerhetsstyring (ISMS), Sikkerhetsovervåkning (SOC) og Identitets- og tilgangsstyring (IAM). ISMS-dimensjonen er delvis utenfor IT4IT-scope.",
  },
  {
    type: "Styring", navn: "Teknologistyring",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["Strategy"],
    undernivåer: ["Definere virksomhets- og målarkitektur", "Utøve arkitekturstyring"],
    dekning: "✓", merknad: "Strategy-gruppen (Architecture, Policy). Realiserer kapabilitet Virksomhetsarkitektur og metodestyring og Kapabilitetskartlegging og heatmap.",
  },
  {
    type: "Styring", navn: "Styring av data og analysebehov",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["Strategy", "Portfolio"],
    undernivåer: ["Håndtere analysebehov", "Definere og utøve styring av masterdata", "Definere og utøve kontrollmekanismer for data", "Definere rammer for informasjonsforvaltning"],
    dekning: "~", merknad: "IT4IT v3 har begrenset eksplisitt dekning av data governance. Nærmest Strategy (Architecture) + Portfolio (Digital Product). Realiserer kapabilitet Informasjons- og dataforvaltning og Analysekapabilitet og datainnsikt.",
  },
  {
    type: "Styring", navn: "Leverandørstyring",
    verdistrømmer: ["Evaluere produkter", "Tverrgående"], funksjonelleGrupper: ["Strategy", "Portfolio"],
    undernivåer: ["Markeds- og leverandøranalyser", "Overordnet styring av leverandøraktivitetene", "Utvikling og oppfølging av styringsstrukturen", "Strategiutvikling Leverandør"],
    dekning: "~", merknad: "Strategy (Proposal, Policy) + Portfolio. Realiserer kapabilitetene Leverandørstyring og anskaffelse og Leverandørkjedesikkerhet.",
  },
  {
    type: "Styring", navn: "Forretningskontinuitet og beredskap",
    verdistrømmer: ["Drifte produkter", "Tverrgående"], funksjonelleGrupper: ["Assure"],
    undernivåer: [],
    dekning: "~", merknad: "Assure-gruppen (Runbook, Service Contract). Realiserer kapabilitet Beredskap og kontinuitetsstyring. BCP/BCM er delvis utenfor IT4IT-kjernen.",
  },

  // ── Støtteprosesser ──────────────────────────────────────────────────────
  {
    type: "Støtte", navn: "Økonomi",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["Portfolio"],
    undernivåer: [],
    dekning: "~", merknad: "Portfolio (Cost Model). Understøtter kapabilitet Investeringsstyring og business case. Finansprosessen i seg selv er utenfor IT4IT Digital Value Network-scopet.",
  },
  {
    type: "Støtte", navn: "Juridisk og regulatorisk rådgivning",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["Strategy"],
    undernivåer: ["Juridisk rådgivning og veiledning", "Tvisteløsning og forhandlinger"],
    dekning: "~", merknad: "Strategy (Policy). Understøtter kapabilitet Regulatorisk etterlevelse og rammestyring. Juridisk funksjon er ikke dekket normativt av IT4IT.",
  },
  {
    type: "Støtte", navn: "HR",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["—"],
    undernivåer: [],
    dekning: "⚠", merknad: "Utenfor IT4IT Digital Value Network-scope. Understøtter kapabiliteter i domene Kompetanse og organisasjon (kap-041–kap-045), men IT4IT har ingen HR-funksjonell gruppe.",
  },
  {
    type: "Støtte", navn: "Intern IKT",
    verdistrømmer: ["Bruke produkter", "Drifte produkter"], funksjonelleGrupper: ["Support", "Assure"],
    undernivåer: [],
    dekning: "✓", merknad: "Support (Incident, Request) + Assure. Intern IKT er i praksis SP som tjenestemottaker av egne tjenester.",
  },
  {
    type: "Støtte", navn: "Leverandørhåndtering",
    verdistrømmer: ["Evaluere produkter", "Tverrgående"], funksjonelleGrupper: ["Strategy", "Portfolio"],
    undernivåer: ["Initiere anskaffelse", "Anskaffe", "Innføre avtale", "Drifte og forvalte avtale", "Revidere lisenser", "Håndtere mislighold og reklamasjon", "Avvikle avtale"],
    dekning: "✓", merknad: "Strategy (Proposal) + Portfolio. Realiserer kapabilitet Leverandørstyring og anskaffelse.",
  },
  {
    type: "Støtte", navn: "Eiendomsforvaltning",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["—"],
    undernivåer: [],
    dekning: "⚠", merknad: "Utenfor IT4IT Digital Value Network-scope. Ingen direkte kobling til kapabilitetsmodellen for IT og teknologi.",
  },
  {
    type: "Støtte", navn: "Kommunikasjon",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["—"],
    undernivåer: [],
    dekning: "⚠", merknad: "Utenfor IT4IT Digital Value Network-scope. Understøtter kapabilitet Onboarding og brukeradopsjon indirekte.",
  },
  {
    type: "Støtte", navn: "HMS",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["—"],
    undernivåer: [],
    dekning: "⚠", merknad: "Utenfor IT4IT Digital Value Network-scope. Ingen IT4IT-kobling.",
  },
  {
    type: "Støtte", navn: "Utvikle (støttefunksjon)",
    verdistrømmer: ["Tverrgående"], funksjonelleGrupper: ["Strategy"],
    undernivåer: [],
    dekning: "~", merknad: "Intern kompetanseutvikling. Støtter kapabilitet Kompetanseutvikling og talentstyring. Nærmest Strategy (Policy).",
  },
];
