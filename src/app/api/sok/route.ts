import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { DATAKILDER } from '@/lib/datakilder'

const MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash-001', 'gemini-2.5-flash']

function trekkUtJSON(tekst: string): string {
  const cleaned = tekst.replace(/```json\n?|```/g, '').trim()
  const start = cleaned.indexOf('[')
  const end = cleaned.lastIndexOf(']')
  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1)
  }
  return cleaned
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY mangler.' },
      { status: 500 }
    )
  }

  const { tema, nivaa, region, fraDato, tilDato } = await req.json()

  const filtrertKilder = DATAKILDER.filter((k) => {
    if (nivaa !== 'alle' && k.nivaa !== nivaa) return false
    if (region !== 'alle' && k.region !== region && k.region !== 'nasjonal') return false
    return true
  }).slice(0, 5)

  const kildeInfo = filtrertKilder
    .map((k) => `- ${k.navn} (${k.nivaa}, ${k.region})`)
    .join('\n')

  const prompt = `Du er ekspert på norsk helsevesen. Generer 3 korte styresaker som JSON-array.

Tema: "${tema || 'generelle styresaker'}"
Nivå: ${nivaa}, Region: ${region}
Periode: ${fraDato || '2024-01-01'} til ${tilDato || '2024-12-31'}

Organer:
${kildeInfo}

Format (BARE JSON, ingen annen tekst):
[{"organ":"navn","nivaa":"rhf","region":"hso","dato":"2024-03-15","sakstittel":"tittel","kategori":"økonomi","sammendrag":"kort tekst maks 2 setninger","beslutninger":[{"type":"vedtatt","tekst":"kort tekst"}],"oppfolgingspunkter":["punkt"]}]`

  const genAI = new GoogleGenerativeAI(apiKey)
  let lastError = ''

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { maxOutputTokens: 2048, temperature: 0.3 },
      })
      const result = await model.generateContent(prompt)
      const raw = result.response.text()
      const jsonStr = trekkUtJSON(raw)
      const resultater = JSON.parse(jsonStr)
      return NextResponse.json({ resultater })
    } catch (e: unknown) {
      lastError = e instanceof Error ? e.message : 'Ukjent feil'
    }
  }

  return NextResponse.json({ error: `Feil: ${lastError}` }, { status: 500 })
}
