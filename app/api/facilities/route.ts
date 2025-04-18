import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

// Define interfaces
interface Facility {
  _id?: ObjectId;
  id?: string;
  name: string;
  description: string;
  features?: string[];
  images?: string[];
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FacilityResponse {
  id: string;
  name: string;
  description: string;
  features: string[];
  images: string[];
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("fashion_institute")

    const facilities: Facility[] = (await db.collection("facilities").find({}).sort({ order: 1 }).toArray()).map(doc => ({ ...doc, _id: doc._id.toString() })) as unknown as Facility[]
    
    // Transform facilities to ensure each has a proper ID and valid image paths
    const transformedFacilities: FacilityResponse[] = facilities.map((facility: Facility) => {
      // Ensure each facility has an id field
      const id = facility.id || facility._id?.toString() || `facility-${Math.random().toString(36).slice(2, 11)}`
      
      // Ensure image paths are valid
      const images = Array.isArray(facility.images) && facility.images.length > 0
        ? facility.images.map(img => img || "/placeholder.svg")
        : ["/placeholder.svg?height=300&width=500"]
      
      return {
        ...facility,
        id,
        images,
        features: facility.features || []
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedFacilities,
    })
  } catch (error: unknown) {
    console.error("Database error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch facilities" 
    }, { status: 500 })
  }
}

interface CreateFacilityRequest {
  name: string;
  description: string;
  features?: string[];
  images?: string[];
  order?: number;
}

export async function POST(request: Request) {
  try {
    const { name, description, features, images, order }: CreateFacilityRequest = await request.json()

    // Validate input
    if (!name || name.trim() === "") {
      return NextResponse.json({ success: false, error: "Facility name is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("fashion_institute")

    const newFacility: Facility = {
      name,
      description,
      features: features || [],
      images: images || [],
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("facilities").insertOne(newFacility)

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: result.insertedId,
          ...newFacility,
        },
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    console.error("Database error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create facility" 
    }, { status: 500 })
  }
}
