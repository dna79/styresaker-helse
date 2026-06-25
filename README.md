# Styresaker Helse

AI-drevet app for oversikt og oppsummering av styresaker i norsk helsevesen.

## Dekning

- **Departement**: Helse- og omsorgsdepartementet (HOD)
- **RHF**: Alle fire regionale helseforetak
- **HF**: Helseforetak i alle regioner
- **IKT**: Sykehuspartner, Helse Vest IKT, Hemit, Helse Nord IKT, Norsk Helsenett

## Kom i gang

### 1. Klon og installer

```bash
git clone https://github.com/dna79/styresaker-helse.git
cd styresaker-helse
npm install
```

### 2. Sett opp API-nøkkel

Hent gratis Gemini API-nøkkel på [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

```bash
cp .env.example .env.local
# Rediger .env.local og lim inn din GEMINI_API_KEY
```

### 3. Kjør lokalt

```bash
npm run dev
# Åpne http://localhost:3000
```

## Deploy til Vercel

1. Push til GitHub (allerede gjort)
2. Gå til [vercel.com](https://vercel.com) og importer dette repositoriet
3. Legg til miljøvariabel: `GEMINI_API_KEY=din_nøkkel`
4. Klikk Deploy

Gratis-tier på Gemini: 1 500 req/dag, 10 req/min med `gemini-1.5-flash`.

## Teknologi

- **Frontend**: Next.js 14, React, Tailwind CSS
- **AI**: Google Gemini 1.5 Flash (gratis tier)
- **Deploy**: Vercel
