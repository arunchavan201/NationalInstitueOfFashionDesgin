"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

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
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading our amazing facilities...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center p-8 rounded-lg shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our World-Class Facilities
        </motion.h1>
        
        <motion.p 
          className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore our state-of-the-art facilities designed to nurture creativity and excellence in fashion education.
        </motion.p>

        <Tabs defaultValue={allFacilities[0]?.id || "design-studio"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-8 p-1 bg-white/30 backdrop-blur-sm rounded-xl shadow-md">
            {allFacilities.map((facility: Facility) => (
              <TabsTrigger 
                key={facility.id} 
                value={facility.id}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300 py-3"
              >
                {facility.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {allFacilities.map((facility: Facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TabsContent value={facility.id} className="mt-6">
                <Card className="overflow-hidden border-none shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative h-[400px] overflow-hidden">
                        {facility.images && facility.images[0] ? (
                          <Image
                            src={
                              !facility.images[0].startsWith('/') && !facility.images[0].startsWith('http')
                                ? `/api/files/${facility.images[0]}`
                                : facility.images[0]
                            }
                            alt={facility.name}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
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
                      <div className="p-8 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">{facility.name}</h2>
                        <div className="prose max-w-none text-gray-600">
                          {typeof facility.description === "string" ? (
                            <p>{facility.description}</p>
                          ) : (
                            <div dangerouslySetInnerHTML={{ __html: facility.description as string || "" }} />
                          )}
                        </div>

                        {facility.features && facility.features.length > 0 && (
                          <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Key Features</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {facility.features.map((feature: string, index: number) => (
                                <li key={index} className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {facility.images && facility.images.length > 1 && (
                      <div className="p-8 bg-gradient-to-b from-transparent to-gray-50">
                        <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Gallery</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {facility.images.slice(1).map((image: string, index: number) => (
                            <div key={index} className="relative h-52 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                              <Image
                                src={
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
            </motion.div>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
