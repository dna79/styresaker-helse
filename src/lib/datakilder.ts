export interface Datakilde {
  navn: string
  nivaa: 'departement' | 'rhf' | 'hf' | 'ikt'
  region: 'hso' | 'vest' | 'midt' | 'nord' | 'nasjonal'
  url: string
  beskrivelse: string
}

export const DATAKILDER: Datakilde[] = [
  // Departement
  {
    navn: 'Helse- og omsorgsdepartementet (HOD)',
    nivaa: 'departement',
    region: 'nasjonal',
    url: 'https://www.regjeringen.no/no/dep/hod/id421/',
    beskrivelse: 'Oppdragsdokumenter, foretaksmøteprotokoller og styringsdokumenter'
  },
  // RHF
  {
    navn: 'Helse Sør-Øst RHF',
    nivaa: 'rhf',
    region: 'hso',
    url: 'https://www.helse-sorost.no/om-oss/styret',
    beskrivelse: 'Styreprotokoller og saksdokumenter fra Helse Sør-Øst'
  },
  {
    navn: 'Helse Vest RHF',
    nivaa: 'rhf',
    region: 'vest',
    url: 'https://www.helse-vest.no/om-helse-vest/styret/',
    beskrivelse: 'Styreprotokoller og saksdokumenter fra Helse Vest'
  },
  {
    navn: 'Helse Midt-Norge RHF',
    nivaa: 'rhf',
    region: 'midt',
    url: 'https://www.helse-midt.no/om-oss/styret/',
    beskrivelse: 'Styreprotokoller og saksdokumenter fra Helse Midt-Norge'
  },
  {
    navn: 'Helse Nord RHF',
    nivaa: 'rhf',
    region: 'nord',
    url: 'https://www.helse-nord.no/om-helse-nord/styret/',
    beskrivelse: 'Styreprotokoller og saksdokumenter fra Helse Nord'
  },
  // HF Sør-Øst
  {
    navn: 'Oslo universitetssykehus HF',
    nivaa: 'hf',
    region: 'hso',
    url: 'https://oslo-universitetssykehus.no/om-oss/styret',
    beskrivelse: 'Styresaker fra OUS'
  },
  {
    navn: 'Akershus universitetssykehus HF',
    nivaa: 'hf',
    region: 'hso',
    url: 'https://www.ahus.no/om-ahus/styret',
    beskrivelse: 'Styresaker fra Ahus'
  },
  {
    navn: 'Sykehuset Innlandet HF',
    nivaa: 'hf',
    region: 'hso',
    url: 'https://www.sykehuset-innlandet.no/om-oss/styret',
    beskrivelse: 'Styresaker fra Sykehuset Innlandet'
  },
  {
    navn: 'Vestre Viken HF',
    nivaa: 'hf',
    region: 'hso',
    url: 'https://www.vestreviken.no/om-oss/styret',
    beskrivelse: 'Styresaker fra Vestre Viken'
  },
  {
    navn: 'Sykehuset Østfold HF',
    nivaa: 'hf',
    region: 'hso',
    url: 'https://www.sykehuset-ostfold.no/om-oss/styret',
    beskrivelse: 'Styresaker fra Sykehuset Østfold'
  },
  // HF Vest
  {
    navn: 'Haukeland universitetssjukehus (Helse Bergen HF)',
    nivaa: 'hf',
    region: 'vest',
    url: 'https://www.helse-bergen.no/om-helse-bergen/styret',
    beskrivelse: 'Styresaker fra Helse Bergen'
  },
  {
    navn: 'Helse Stavanger HF (SUS)',
    nivaa: 'hf',
    region: 'vest',
    url: 'https://www.sus.no/om-oss/styret',
    beskrivelse: 'Styresaker fra Stavanger universitetssjukehus'
  },
  // HF Midt
  {
    navn: 'St. Olavs hospital HF',
    nivaa: 'hf',
    region: 'midt',
    url: 'https://stolav.no/om-oss/styret',
    beskrivelse: 'Styresaker fra St. Olavs hospital'
  },
  // HF Nord
  {
    navn: 'Universitetssykehuset Nord-Norge HF',
    nivaa: 'hf',
    region: 'nord',
    url: 'https://unn.no/om-unn/styret',
    beskrivelse: 'Styresaker fra UNN'
  },
  {
    navn: 'Nordlandssykehuset HF',
    nivaa: 'hf',
    region: 'nord',
    url: 'https://www.nordlandssykehuset.no/om-oss/styret',
    beskrivelse: 'Styresaker fra Nordlandssykehuset'
  },
  // IKT
  {
    navn: 'Sykehuspartner HF (HSØ)',
    nivaa: 'ikt',
    region: 'hso',
    url: 'https://sykehuspartner.no/om-sykehuspartner/styret',
    beskrivelse: 'IKT og tjenestepartner for Helse Sør-Øst'
  },
  {
    navn: 'Helse Vest IKT AS',
    nivaa: 'ikt',
    region: 'vest',
    url: 'https://www.helse-vest-ikt.no/om-oss/styret',
    beskrivelse: 'IKT-selskap for Helse Vest'
  },
  {
    navn: 'Hemit (Helse Midt-Norge IT)',
    nivaa: 'ikt',
    region: 'midt',
    url: 'https://www.hemit.no/om-hemit/styret',
    beskrivelse: 'IKT-selskap for Helse Midt-Norge'
  },
  {
    navn: 'Helse Nord IKT',
    nivaa: 'ikt',
    region: 'nord',
    url: 'https://www.hnikt.no/om-oss/styret',
    beskrivelse: 'IKT-selskap for Helse Nord'
  },
  {
    navn: 'Norsk Helsenett SF',
    nivaa: 'ikt',
    region: 'nasjonal',
    url: 'https://www.nhn.no/om-nhn/styret',
    beskrivelse: 'Nasjonal nettverksleverandør for helsesektoren'
  }
]
