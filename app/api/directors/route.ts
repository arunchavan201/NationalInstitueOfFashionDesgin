import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("fashion_institute")

    const directors = await db.collection("directors").find({}).sort({ order: 1 }).toArray()

    return NextResponse.json({
      success: true,
      data: directors || [],
      count: directors?.length || 0
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch directors data",
      message: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
