import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash-001', 'gemini-2.5-flash']

function trekkUtJSON(tekst: string): string {
  const cleaned = tekst.replace(/```json\n?|```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1)
  }
  return cleaned
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY mangler.' }, { status: 500 })
  }

  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'URL mangler' }, { status: 400 })

  const prompt = `Du er ekspert på norsk helsevesen. Analyser styredokumentet fra URL: ${url}

Returner KUN dette JSON-objektet:
{"organ":"navn","nivaa":"hf","region":"hso","dato":"YYYY-MM-DD","sakstittel":"tittel","kategori":"økonomi","sammendrag":"maks 3 setninger","beslutninger":[{"type":"vedtatt","tekst":"kort"}],"oppfolgingspunkter":["punkt"],"kilde":"${url}"}`

  const genAI = new GoogleGenerativeAI(apiKey)
  let lastError = ''

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.2 },
      })
      const result = await model.generateContent(prompt)
      const raw = result.response.text()
      const jsonStr = trekkUtJSON(raw)
      const resultat = JSON.parse(jsonStr)
      return NextResponse.json({ resultat })
    } catch (e: unknown) {
      lastError = e instanceof Error ? e.message : 'Ukjent feil'
    }
  }

  return NextResponse.json({ error: `Feil: ${lastError}` }, { status: 500 })
}
