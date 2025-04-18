import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("fashion_institute")

    const content = await db.collection("content").findOne({ section: "about" })

    return NextResponse.json({
      success: true,
      data: content || { institute: "", society: "", vision: "", mission: "" },
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch about content",
      message: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.institute || !data.society) {
      return NextResponse.json({
        success: false,
        error: "Institute and society information are required"
      }, { status: 400 })
    }

    const { institute, society, vision, mission } = data

    const client = await clientPromise
    const db = client.db("fashion_institute")

    // Update or insert content
    const result = await db.collection("content").updateOne(
      { section: "about" },
      {
        $set: {
          institute,
          society,
          vision,
          mission,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({
      success: true,
      message: "About content updated successfully",
      modifiedCount: result.modifiedCount,
      upsertedId: result.upsertedId,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to update about content",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
