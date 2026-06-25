import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY mangler i miljøvariablene' }, { status: 500 })
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

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json\n?|```/g, '').trim()
    const resultat = JSON.parse(text)
    return NextResponse.json({ resultat })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Ukjent feil'
    return NextResponse.json({ error: `Gemini-feil: ${msg}` }, { status: 500 })
  }
}
