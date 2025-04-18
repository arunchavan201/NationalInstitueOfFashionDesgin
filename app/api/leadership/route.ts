import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("fashion_institute")

    const leadership = await db.collection("leadership").find({}).toArray()

    return NextResponse.json({
      success: true,
      data: leadership || [],
      count: leadership?.length || 0
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch leadership data",
      message: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
