import Image from "next/image"
import { headers } from "next/headers"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function FacilitiesPage() {
  // Fetch facilities from API
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const baseUrl = `${protocol}://${host}`
  
  let facilities = []
  try {
    const res = await fetch(`${baseUrl}/api/facilities`, { cache: "no-store" })
    const data = await res.json()
    facilities = data.data
  } catch (error) {
    console.error("Error fetching facilities:", error)
  }

  // Default facilities if none are found in the database
  const defaultFacilities = [
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

  // Use API facilities if available, otherwise use defaults
  const allFacilities = facilities.length > 0 ? facilities : defaultFacilities

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Our Facilities</h1>

      <Tabs defaultValue={allFacilities[0]?.id || "design-studio"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-8">
          {allFacilities.map((facility) => (
            <TabsTrigger key={facility.id} value={facility.id}>
              {facility.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {allFacilities.map((facility) => (
          <TabsContent key={facility.id} value={facility.id} className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative h-[300px] rounded-lg overflow-hidden">
                    <Image
                      src={facility.images?.[0] || "/placeholder.svg?height=300&width=500"}
                      alt={facility.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{facility.name}</h2>
                    <div className="prose max-w-none">
                      {typeof facility.description === "string" ? (
                        <p>{facility.description}</p>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: facility.description || "" }} />
                      )}
                    </div>

                    {facility.features && facility.features.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Features:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {facility.features.map((feature, index) => (
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
                      {facility.images.slice(1).map((image, index) => (
                        <div key={index} className="relative h-40 rounded-lg overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${facility.name} image ${index + 2}`}
                            fill
                            className="object-cover"
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
