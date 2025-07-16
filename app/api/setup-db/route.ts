import { type NextRequest, NextResponse } from "next/server"
import { setupDatabase } from "@/lib/supabase/setup-db"

export async function POST(request: NextRequest) {
  try {
    // In production, you would add authentication here
    // to ensure only admins can run this setup

    const result = await setupDatabase()

    if (!result.success) {
      return NextResponse.json({ error: "Failed to set up database" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Setup DB API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
