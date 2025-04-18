"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define types
interface Facility {
  _id: string;
  id?: string;
  name: string;
  description: string;
  images?: string[];
  features?: string[];
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  data: Facility[];
  error?: string;
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const response = await fetch("/api/facilities")
        if (response.ok) {
          const data: ApiResponse = await response.json()
          setFacilities(data.data || [])
        } else {
          throw new Error("Failed to fetch facilities")
        }
      } catch (error) {
        console.error("Error fetching facilities:", error)
        toast({
          title: "Error",
          description: "Failed to load facilities. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFacilities()
  }, [toast])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this facility?")) return

    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete facility")
      }

      setFacilities(facilities.filter((facility) => facility._id !== id))

      toast({
        title: "Success",
        description: "Facility deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facilities</h1>
          <p className="text-gray-500">Manage institute facilities</p>
        </div>
        <Button asChild className="bg-rose-600 hover:bg-rose-700">
          <Link href="/admin/dashboard/facilities/new">
            <Plus className="h-4 w-4 mr-2" /> Add Facility
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Facilities</CardTitle>
          <CardDescription>Facilities are displayed on the Facilities page</CardDescription>
        </CardHeader>
        <CardContent>
          {facilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facilities.map((facility: Facility) => (
                <div key={facility._id} className="flex p-4 border rounded-lg">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src={
                        facility.images?.[0]
                          ? `/api/files/${facility.images[0]}`
                          : "/placeholder.svg?height=80&width=80"
                      }
                      alt={facility.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{facility.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {typeof facility.description === "string" ? facility.description : "Description available"}
                    </p>
                    <div className="flex mt-2 space-x-2">
                      <Button variant="outline" size="icon" asChild className="h-7 w-7">
                        <Link href={`/admin/dashboard/facilities/${facility._id}`}>
                          <Edit className="h-3 w-3" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(facility._id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No facilities found</p>
              <Button asChild className="mt-4 bg-rose-600 hover:bg-rose-700">
                <Link href="/admin/dashboard/facilities/new">Add your first facility</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
