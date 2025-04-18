import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("fashion_institute")

    const committees = await db.collection("committees").find({}).toArray()

    return NextResponse.json({
      success: true,
      data: committees || [],
      count: committees?.length || 0
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch committees",
      message: error instanceof Error ? error.message : "Unknown database error" 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate input
    if (!data.name || data.name.trim() === "") {
      return NextResponse.json({ 
        success: false, 
        error: "Committee name is required" 
      }, { status: 400 })
    }

    const { name, description, members } = data

    const client = await clientPromise
    const db = client.db("fashion_institute")

    const result = await db.collection("committees").insertOne({
      name,
      description: description || "",
      members: members || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const newCommittee = {
      _id: result.insertedId,
      name,
      description: description || "",
      members: members || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: newCommittee,
      message: "Committee created successfully"
    }, { status: 201 })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create committee",
      message: error instanceof Error ? error.message : "Unknown error during committee creation"
    }, { status: 500 })
  }
}
