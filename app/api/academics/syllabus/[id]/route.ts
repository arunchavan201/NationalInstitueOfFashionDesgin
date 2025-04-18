import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid syllabus ID" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("fashion_institute")

    const result = await db.collection("syllabus").deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Syllabus not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Syllabus deleted successfully" }
    )
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete syllabus" },
      { status: 500 }
    )
  }
}
