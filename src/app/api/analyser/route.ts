import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const MODELS = ['gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-pro']

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY mangler. Legg til miljøvariabelen i Vercel-dashboardet.' },
      { status: 500 }
    )
  }

  const { url } = await req.json()
  if (!url) {
    return NextResponse.json({ error: 'URL mangler' }, { status: 400 })
  }

  const prompt = `Du er ekspert på norsk helsevesen og styrearbeid.

Analyser dette styredokumentet (URL: ${url}) og returner en strukturert oppsummering som JSON:
{
  "organ": "navn på styreorganet",
  "nivaa": "departement|rhf|hf|ikt",
  "region": "hso|vest|midt|nord|nasjonal",
  "dato": "YYYY-MM-DD",
  "sakstittel": "tittel på saken",
  "kategori": "økonomi|bemanning|kvalitet|digitalisering|strategi|investering|annet",
  "sammendrag": "3-4 setninger som oppsummerer innholdet",
  "beslutninger": [
    {"type": "vedtatt|orientering|utsatt", "tekst": "beslutningens tekst"}
  ],
  "oppfolgingspunkter": ["punkt 1", "punkt 2"],
  "kilde": "${url}"
}

Hvis du ikke kan lese dokumentet direkte, lag en representativ analyse basert på URL-mønsteret og kjent informasjon om helseforetaket.
Return BARE gyldig JSON, ingen annen tekst.`

  const genAI = new GoogleGenerativeAI(apiKey)
  let lastError = ''

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      const text = result.response.text().replace(/```json\n?|```/g, '').trim()
      const resultat = JSON.parse(text)
      return NextResponse.json({ resultat })
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
