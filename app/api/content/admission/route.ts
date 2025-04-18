import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { WithId, Document } from 'mongodb'

interface AdmissionContent extends Document {
  section: string;
  process?: string;
  importantDates?: string;
  eligibility?: string;
  feeStructure?: string;
  scholarship?: string;
  cancellation?: string;
  brochureId?: string;
  admissionFormId?: string;
  scholarshipFileId?: string;
  admissionInfoId?: string;
  govtResolutions?: Array<{ id: string; name: string }>;
  updatedAt?: Date;
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("fashion_institute")

    // Add cache control headers
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }

    const content = await db.collection<AdmissionContent>("content").findOne({ section: "admission" })

    return NextResponse.json({
      success: true,
      data: content || {},
    }, { headers })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch admission content" 
      }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    )
  }
}

export async function POST(request: Request) {
  try {
    const {
      process,
      importantDates,
      eligibility,
      feeStructure,
      scholarship,
      cancellation,
      brochureId,
      admissionFormId,
      scholarshipFileId,
      admissionInfoId,
      govtResolutions,
    } = await request.json()

    const client = await clientPromise
    const db = client.db("fashion_institute")

    // Update or insert content
    const result = await db.collection<AdmissionContent>("content").updateOne(
      { section: "admission" },
      {
        $set: {
          process,
          importantDates,
          eligibility,
          feeStructure,
          scholarship,
          cancellation,
          brochureId,
          admissionFormId,
          scholarshipFileId,
          admissionInfoId,
          govtResolutions,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({
      success: true,
      message: "Admission content updated successfully",
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ success: false, error: "Failed to update admission content" }, { status: 500 })
  }
}
