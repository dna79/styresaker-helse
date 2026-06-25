import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { DATAKILDER } from '@/lib/datakilder'

const MODELS = ['gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-pro']

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY mangler. Legg til miljøvariabelen i Vercel-dashboardet.' },
      { status: 500 }
    )
  }

  const { tema, nivaa, region, fraDato, tilDato } = await req.json()

  const filtrertKilder = DATAKILDER.filter((k) => {
    if (nivaa !== 'alle' && k.nivaa !== nivaa) return false
    if (region !== 'alle' && k.region !== region && k.region !== 'nasjonal') return false
    return true
  }).slice(0, 8)

  const kildeInfo = filtrertKilder
    .map((k) => `- ${k.navn} (${k.nivaa}, ${k.region}): ${k.url}`)
    .join('\n')

  const prompt = `Du er ekspert på norsk helsevesen og styrearbeid. Generer realistiske og representative eksempler på styresaker basert på følgende søk:

Søketema: "${tema || 'generelle styresaker'}"
Nivå: ${nivaa}
Region: ${region}
Periode: ${fraDato || '2024-01-01'} til ${tilDato || '2024-12-31'}

Aktuelle organer/kilder:
${kildeInfo}

Generer 4-6 styresaker som JSON-array med denne strukturen:
[
  {
    "organ": "navn på styreorganet",
    "nivaa": "departement|rhf|hf|ikt",
    "region": "hso|vest|midt|nord|nasjonal",
    "dato": "YYYY-MM-DD",
    "sakstittel": "tittel på saken",
    "kategori": "økonomi|bemanning|kvalitet|digitalisering|strategi|investering|annet",
    "sammendrag": "2-3 setninger som oppsummerer saken",
    "beslutninger": [
      {"type": "vedtatt|orientering|utsatt", "tekst": "beslutningens tekst"}
    ],
    "oppfolgingspunkter": ["punkt 1", "punkt 2"]
  }
]

Return BARE gyldig JSON, ingen annen tekst.`

  const genAI = new GoogleGenerativeAI(apiKey)
  let lastError = ''

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      const text = result.response.text().replace(/```json\n?|```/g, '').trim()
      const resultater = JSON.parse(text)
      return NextResponse.json({ resultater })
    } catch (e: unknown) {
      lastError = e instanceof Error ? e.message : 'Ukjent feil'
      if (!lastError.includes('429') && !lastError.includes('404')) break
    }
  }

  const erKvotafeil = lastError.includes('429') || lastError.includes('quota')
  const brukermelding = erKvotafeil
    ? 'Kvoten for Gemini API er oppbrukt eller API-nøkkelen har ikke tilgang. Sjekk at du bruker en AI Studio-nøkkel fra aistudio.google.com/apikey og at Generative Language API er aktivert i Google Cloud-prosjektet.'
    : `Gemini-feil: ${lastError}`

  return NextResponse.json({ error: brukermelding }, { status: 500 })
}
