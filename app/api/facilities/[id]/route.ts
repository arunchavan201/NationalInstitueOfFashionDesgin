import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Facility ID is required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("fashion_institute")
    
    // Try to parse the ID as ObjectId
    let objectId
    try {
      objectId = new ObjectId(id)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid facility ID format" },
        { status: 400 }
      )
    }

    // Delete the facility
    const result = await db.collection("facilities").deleteOne({ _id: objectId })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Facility not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: { deletedId: id } })
  } catch (error: unknown) {
    console.error("Error deleting facility:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to delete facility" 
      },
      { status: 500 }
    )
  }
}

// Also add a GET endpoint for individual facility retrieval
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Facility ID is required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("fashion_institute")
    
    let objectId
    try {
      objectId = new ObjectId(id)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid facility ID format" },
        { status: 400 }
      )
    }

    const facility = await db.collection("facilities").findOne({ _id: objectId })

    if (!facility) {
      return NextResponse.json(
        { success: false, error: "Facility not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...facility,
        _id: facility._id.toString(),
        id: facility._id.toString()
      }
    })
  } catch (error: unknown) {
    console.error("Error retrieving facility:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to retrieve facility" 
      },
      { status: 500 }
    )
  }
}
