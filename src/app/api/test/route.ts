import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY mangler' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }
    const modeller = (data.models ?? []).map((m: { name: string; supportedGenerationMethods?: string[] }) => ({
      name: m.name,
      kanGenerere: m.supportedGenerationMethods?.includes('generateContent'),
    }))
    return NextResponse.json({ antall: modeller.length, modeller })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
