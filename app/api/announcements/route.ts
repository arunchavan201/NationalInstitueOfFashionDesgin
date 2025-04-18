import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Response helper function
function createResponse(success: boolean, data?: any, statusCode = 200, error?: string) {
  return NextResponse.json(
    {
      success,
      ...(data && { data }),
      ...(error && { error })
    },
    { 
      status: statusCode, 
      headers: { 
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": "application/json"
      } 
    }
  )
}

// Get all active announcements
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("fashion_institute")
    
    // Get all active announcements
    const announcements = await db
      .collection("announcements")
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray()

    return createResponse(true, announcements)
  } catch (error) {
    console.error("Database error:", error)
    return createResponse(false, null, 500, "Failed to fetch announcements")
  }
}

// Create new announcement
export async function POST(request: Request) {
  try {
    const { text, link, isActive = true } = await request.json()

    // Validate input
    if (!text || text.trim() === "") {
      return createResponse(false, null, 400, "Announcement text is required")
    }

    const client = await clientPromise
    const db = client.db("fashion_institute")

    // Create new announcement
    const newAnnouncement = {
      text,
      link,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const result = await db.collection("announcements").insertOne(newAnnouncement)

    return createResponse(
      true, 
      {
        _id: result.insertedId,
        ...newAnnouncement,
      }, 
      201
    )
  } catch (error) {
    console.error("Database error:", error)
    return createResponse(false, null, 500, "Failed to create announcement")
  }
}

// Delete an announcement
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return createResponse(false, null, 400, "Missing announcement id")
    }
    
    const client = await clientPromise
    const db = client.db("fashion_institute")
    
    const result = await db.collection("announcements").deleteOne({ 
      _id: new ObjectId(id) 
    })
    
    if (result.deletedCount === 1) {
      return createResponse(true, { deletedCount: result.deletedCount })
    } else {
      return createResponse(false, null, 404, "Announcement not found")
    }
  } catch (error) {
    console.error("Delete error:", error)
    return createResponse(false, null, 500, "Failed to delete announcement")
  }
}

// Update an announcement
export async function PUT(request: Request) {
  try {
    const { id, text, link, isActive } = await request.json()
    
    if (!id) {
      return createResponse(false, null, 400, "Announcement ID is required")
    }
    
    if (!text && link === undefined && isActive === undefined) {
      return createResponse(false, null, 400, "No fields to update")
    }
    
    const client = await clientPromise
    const db = client.db("fashion_institute")
    
    const updateData: Record<string, any> = {
      updatedAt: new Date()
    }
    
    if (text !== undefined) updateData.text = text
    if (link !== undefined) updateData.link = link
    if (isActive !== undefined) updateData.isActive = isActive
    
    const result = await db.collection("announcements").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return createResponse(false, null, 404, "Announcement not found")
    }
    
    return createResponse(true, { modifiedCount: result.modifiedCount })
  } catch (error) {
    console.error("Update error:", error)
    return createResponse(false, null, 500, "Failed to update announcement")
  }
}
