import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("fashion_institute")

    const calendars = await db.collection("academic_calendars").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      data: calendars,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch academic calendars" 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, fileId, academicYear } = await request.json()

    // Validate input
    if (!title || !fileId) {
      return NextResponse.json({ 
        success: false, 
        error: "Title and file ID are required" 
      }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("fashion_institute")

    const currentYear = new Date().getFullYear()
    const defaultAcademicYear = `${currentYear}-${currentYear + 1}`

    const newCalendar = {
      title,
      fileId,
      academicYear: academicYear || defaultAcademicYear,
      createdAt: new Date(),
    }

    const result = await db.collection("academic_calendars").insertOne(newCalendar)

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: result.insertedId,
          ...newCalendar,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to add academic calendar" 
    }, { status: 500 })
  }
}
