import { Kapabilitet } from "./types";

let counter = 0;
function id() {
  return `cap-${++counter}`;
}

export const SEED_DATA: Kapabilitet[] = [
  // Evaluere produkter
  { id: id(), navn: "Porteføljestyring", verdistrøm: "Evaluere produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Kapabilitetskartlegging og heatmap", verdistrøm: "Evaluere produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Strategisk prioritering og business case", verdistrøm: "Evaluere produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Leverandørstyring i multicloud", verdistrøm: "Evaluere produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Investeringsstyring og finansieringskobling", verdistrøm: "Evaluere produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Regulatorisk etterlevelse og rammestyring", verdistrøm: "Evaluere produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Behovsinnhenting fra produktområder/HF", verdistrøm: "Evaluere produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Produkt", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },

  // Utforske produkter
  { id: id(), navn: "Krav- og behovsstyring", verdistrøm: "Utforske produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Produkt", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Tjenestedesign og konseptutvikling", verdistrøm: "Utforske produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Løsningsarkitektur tidlig fase", verdistrøm: "Utforske produkter", teamtype: "Støtteteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Innovasjonsledelse og eksperimentering", verdistrøm: "Utforske produkter", teamtype: "Støtteteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Lav", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Brukerinnsikt og UX-kapabilitet", verdistrøm: "Utforske produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Produkt", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Produktdefinisjon og verdiforslag", verdistrøm: "Utforske produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Avhengighetsanalyse", verdistrøm: "Utforske produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },

  // Utvikle nye produkter
  { id: id(), navn: "Utviklingskapasitet intern og konsulent", verdistrøm: "Utvikle nye produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "CI/CD og DevSecOps-praksis", verdistrøm: "Utvikle nye produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Datadeling og integrasjonsarkitektur", verdistrøm: "Utvikle nye produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "API-styring og forvaltning", verdistrøm: "Utvikle nye produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Testautomatisering og kvalitetssikring", verdistrøm: "Utvikle nye produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Kildekontroll og versjonsstyring", verdistrøm: "Utvikle nye produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Teknisk gjeldsstyring", verdistrøm: "Utvikle nye produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },

  // Produksjonssette produkter
  { id: id(), navn: "Endringsstyring (Change Management)", verdistrøm: "Produksjonssette produkter", teamtype: "Støtteteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Konfigurasjonsstyring og CMDB", verdistrøm: "Produksjonssette produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Sikkerhetsgodkjenning og MTU-regelverk", verdistrøm: "Produksjonssette produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Release-komposisjon og pakkestyring", verdistrøm: "Produksjonssette produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Gevinst- og endringsgjennomføring", verdistrøm: "Produksjonssette produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Produkt", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Tilgangsstyring (Access Management)", verdistrøm: "Produksjonssette produkter", teamtype: "Plattformteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Masterdata og dokumentasjonsoppdatering", verdistrøm: "Produksjonssette produkter", teamtype: "Støtteteam", prosesstype: "Støtte", eierskap: "Kjerne", kritikalitet: "Lav", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },

  // Tilgjengeliggjøre produkter
  { id: id(), navn: "Infrastruktur- og plattformstyring", verdistrøm: "Tilgjengeliggjøre produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Skytjenestestyring og cloud governance", verdistrøm: "Tilgjengeliggjøre produkter", teamtype: "Plattformteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Automatisert utrulling (IaC/CI-CD)", verdistrøm: "Tilgjengeliggjøre produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Nettverksstyring og sikkerhetssegmentering", verdistrøm: "Tilgjengeliggjøre produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Sandkasse- og testmiljøstyring", verdistrøm: "Tilgjengeliggjøre produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Kapasitetsstyring og skalering", verdistrøm: "Tilgjengeliggjøre produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Beredskap og kontinuitetsstyring", verdistrøm: "Tilgjengeliggjøre produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },

  // Bruke produkter
  { id: id(), navn: "Tjenestekatalog og bestillingsløsning", verdistrøm: "Bruke produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Selvbetjeningskapabilitet (sluttbruker)", verdistrøm: "Bruke produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Avtale- og SLA-styring", verdistrøm: "Bruke produkter", teamtype: "Støtteteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Identitets- og tilgangsstyring (IAM)", verdistrøm: "Bruke produkter", teamtype: "Plattformteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Onboarding og brukeradopsjon", verdistrøm: "Bruke produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Produkt", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Fakturering og kostnadsfordeling (FinOps)", verdistrøm: "Bruke produkter", teamtype: "Støtteteam", prosesstype: "Støtte", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Bruker- og kundeoppfølging", verdistrøm: "Bruke produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },

  // Drifte produkter
  { id: id(), navn: "Hendelses- og problemhåndtering", verdistrøm: "Drifte produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Overvåkning og ytelsesstyring", verdistrøm: "Drifte produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "IT-eiendels- og konfigurasjonsstyring", verdistrøm: "Drifte produkter", teamtype: "Plattformteam", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Leverandørkjedeoppfølging og sikkerhet", verdistrøm: "Drifte produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Sikkerhetsovervåkning og hendelsesrespons", verdistrøm: "Drifte produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Kundesupport og brukerstøtte (servicedesk)", verdistrøm: "Drifte produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Kontinuerlig forbedring (CSIP)", verdistrøm: "Drifte produkter", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Standardiserte leveranser (katalogtjenester)", verdistrøm: "Drifte produkter", teamtype: "Produktområde", prosesstype: "Kjerne", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },

  // Tverrgående
  { id: id(), navn: "Informasjons- og dataforvaltning", verdistrøm: "Tverrgående", teamtype: "Plattformteam", prosesstype: "Støtte", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Risikostyring og personvern (GDPR)", verdistrøm: "Tverrgående", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Kompetanseutvikling og talentstyring", verdistrøm: "Tverrgående", teamtype: "Støtteteam", prosesstype: "Støtte", eierskap: "Kjerne", kritikalitet: "Middels", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Virksomhetsarkitektur og metodestyring", verdistrøm: "Tverrgående", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
  { id: id(), navn: "Sikkerhetsstyring (ISMS)", verdistrøm: "Tverrgående", teamtype: "Støtteteam", prosesstype: "Styring", eierskap: "Kjerne", kritikalitet: "Høy", klassifisering: "IkkeVurdert", modenhetNå: 0, modenhetMål: 0, notater: "" },
];
