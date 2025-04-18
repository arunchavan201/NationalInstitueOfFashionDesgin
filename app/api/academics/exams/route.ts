import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("fashion_institute")

    const examInfo = await db.collection("content").findOne({ section: "exams" })
    const schedules = await db.collection("exam_schedules").find({}).sort({ createdAt: -1 }).toArray()
    const results = await db.collection("exam_results").find({}).sort({ createdAt: -1 }).toArray()

    // Convert MongoDB objects to JSON-serializable objects
    const serializableSchedules = schedules.map(doc => ({
      ...doc,
      _id: doc._id.toString(),
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt
    }))

    const serializableResults = results.map(doc => ({
      ...doc,
      _id: doc._id.toString(),
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt
    }))

    return NextResponse.json({
      success: true,
      data: {
        examInfo: examInfo?.examInfo || "",
        schedules: serializableSchedules,
        results: serializableResults,
      },
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch exam data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    const client = await clientPromise
    const db = client.db("fashion_institute")
    const body = await request.json()

    if (pathname.endsWith("/schedules")) {
      // Validate request body
      if (!body.title || !body.fileId) {
        return NextResponse.json({ 
          success: false, 
          error: "Title and fileId are required" 
        }, { status: 400 })
      }

      const schedule = await db.collection("exam_schedules").insertOne({
        title: body.title,
        fileId: body.fileId,
        createdAt: new Date(),
      })
      
      return NextResponse.json({ 
        success: true, 
        data: { 
          _id: schedule.insertedId.toString(), 
          title: body.title, 
          fileId: body.fileId, 
          createdAt: new Date().toISOString() 
        } 
      })
    } else if (pathname.endsWith("/results")) {
      // Add endpoint for adding results
      if (!body.title || !body.fileId) {
        return NextResponse.json({ 
          success: false, 
          error: "Title and fileId are required" 
        }, { status: 400 })
      }

      const result = await db.collection("exam_results").insertOne({
        title: body.title,
        fileId: body.fileId,
        createdAt: new Date(),
      })
      
      return NextResponse.json({ 
        success: true, 
        data: { 
          _id: result.insertedId.toString(), 
          title: body.title, 
          fileId: body.fileId, 
          createdAt: new Date().toISOString()
        } 
      })
    } else if (pathname.endsWith("/info")) {
      // Validate request body
      if (!body.examInfo) {
        return NextResponse.json({ 
          success: false, 
          error: "examInfo is required" 
        }, { status: 400 })
      }
      
      await db.collection("content").updateOne(
        { section: "exams" },
        { $set: { examInfo: body.examInfo } },
        { upsert: true }
      )
      
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Unsupported endpoint" }, { status: 404 })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
