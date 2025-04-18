"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define the Facility interface
interface Facility {
  id: string;
  _id?: string;
  name: string;
  description: string | React.ReactNode;
  images: string[];
  features?: string[];
  order?: number;
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Default facilities if none are found in the database
  const defaultFacilities: Facility[] = [
    {
      id: "design-studio",
      name: "Design Studios",
      description:
        "Our state-of-the-art design studios are equipped with modern drafting tables, mannequins, and design tools to help students bring their creative visions to life.",
      images: ["/placeholder.svg?height=300&width=500"],
    },
    {
      id: "computer-lab",
      name: "Computer Labs",
      description:
        "Our computer labs feature the latest design software including Adobe Creative Suite, CLO 3D, and other industry-standard tools for digital fashion design and pattern making.",
      images: ["/placeholder.svg?height=300&width=500"],
    },
    {
      id: "sewing-lab",
      name: "Sewing & Pattern Making Lab",
      description:
        "Equipped with industrial and domestic sewing machines, sergers, and pattern-making tools, our sewing labs provide hands-on experience in garment construction.",
      images: ["/placeholder.svg?height=300&width=500"],
    },
    {
      id: "textile-lab",
      name: "Textile Lab",
      description:
        "Our textile lab allows students to experiment with various fabrics, dyeing techniques, and textile manipulations to create unique materials for their designs.",
      images: ["/placeholder.svg?height=300&width=500"],
    },
    {
      id: "photography-studio",
      name: "Photography Studio",
      description:
        "A professional photography studio with lighting equipment and backdrops for fashion photography and portfolio development.",
      images: ["/placeholder.svg?height=300&width=500"],
    },
    {
      id: "exhibition-space",
      name: "Exhibition Space",
      description:
        "A dedicated area for displaying student work, hosting fashion shows, and showcasing design collections to the public and industry professionals.",
      images: ["/placeholder.svg?height=300&width=500"],
    },
  ]

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/facilities')
        
        if (!response.ok) {
          throw new Error('Failed to fetch facilities')
        }
        
        const data = await response.json()
        if (data.success && data.data && data.data.length > 0) {
          // Make sure each facility has an id property
          const facilitiesWithIds: Facility[] = data.data.map((facility: any) => ({
            ...facility,
            id: facility.id || facility._id || `facility-${Math.random().toString(36).substr(2, 9)}`
          }))
          setFacilities(facilitiesWithIds)
        } else {
          setFacilities([])
        }
      } catch (err: unknown) {
        console.error("Error fetching facilities:", err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setFacilities([])
      } finally {
        setLoading(false)
      }
    }

    fetchFacilities()
  }, [])

  // Use API facilities if available, otherwise use defaults
  const allFacilities: Facility[] = facilities.length > 0 ? facilities : defaultFacilities

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading facilities...</div>
  }

  if (error) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">Error: {error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Our Facilities</h1>

      <Tabs defaultValue={allFacilities[0]?.id || "design-studio"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-8">
          {allFacilities.map((facility: Facility) => (
            <TabsTrigger key={facility.id} value={facility.id}>
              {facility.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {allFacilities.map((facility: Facility) => (
          <TabsContent key={facility.id} value={facility.id} className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative h-[300px] rounded-lg overflow-hidden">
                    {facility.images && facility.images[0] ? (
                      <Image
                        src={
                          // Check if image is an ID (not a URL/path)
                          !facility.images[0].startsWith('/') && !facility.images[0].startsWith('http')
                            ? `/api/files/${facility.images[0]}`
                            : facility.images[0]
                        }
                        alt={facility.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=300&width=500"
                        }}
                      />
                    ) : (
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt={facility.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{facility.name}</h2>
                    <div className="prose max-w-none">
                      {typeof facility.description === "string" ? (
                        <p>{facility.description}</p>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: facility.description as string || "" }} />
                      )}
                    </div>

                    {facility.features && facility.features.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Features:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {facility.features.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {facility.images && facility.images.length > 1 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">More Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {facility.images.slice(1).map((image: string, index: number) => (
                        <div key={index} className="relative h-40 rounded-lg overflow-hidden">
                          <Image
                            src={
                              // Check if image is an ID (not a URL/path)
                              !image.startsWith('/') && !image.startsWith('http')
                                ? `/api/files/${image}`
                                : image
                            }
                            alt={`${facility.name} image ${index + 2}`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
