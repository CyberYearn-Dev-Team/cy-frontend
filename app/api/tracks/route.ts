import { NextResponse } from "next/server"

export async function GET() {
  try {
    const url = process.env.DIRECTUS_URL || "http://localhost:8055"
    const res = await fetch(`${url}/items/tracks`, {
      headers: {
        Authorization: `Bearer ${process.env.DIRECTUS_STATIC_TOKEN || ""}`,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`)
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
