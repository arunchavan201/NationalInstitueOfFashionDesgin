"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function GalleryContent() {
  const [categories, setCategories] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [images, setImages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/gallery/categories")
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.length > 0) {
            setCategories(data.data)
            setActiveCategory(data.data[0]._id)
          } else {
            setIsLoading(false)
          }
        } else {
          throw new Error("Failed to fetch categories")
        }
      } catch (error) {
        console.error("Error fetching gallery categories:", error)
        toast({
          title: "Error",
          description: "Failed to load gallery categories. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [toast])

  useEffect(() => {
    if (activeCategory) {
      fetchImages(activeCategory)
    }
  }, [activeCategory])

  async function fetchImages(categoryId: string) {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/gallery/images?categoryId=${categoryId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setImages(data.data)
        } else {
          setImages([])
        }
      } else {
        throw new Error("Failed to fetch images")
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error)
      toast({
        title: "Error",
        description: "Failed to load gallery images. Please try again.",
        variant: "destructive",
      })
      setImages([])
    } finally {
      setIsLoading(false)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">No Gallery Categories Found</h2>
        <p className="text-gray-500">Check back later for updates to our gallery.</p>
      </div>
    )
  }

  const currentCategory = categories.find((cat) => cat._id === activeCategory)

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-rose-200 bg-rose-50 hover:bg-rose-100">
              {currentCategory?.name || "Select Category"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            {categories.map((category) => (
              <DropdownMenuItem key={category._id} onClick={() => setActiveCategory(category._id)}>
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      ) : (
        <>
          {currentCategory && (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-rose-800 mb-2">{currentCategory.name}</h2>
              {currentCategory.description && (
                <p className="text-gray-600 max-w-2xl mx-auto">{currentCategory.description}</p>
              )}
            </div>
          )}

          {images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card key={image._id} className="overflow-hidden hover:shadow-lg transition-shadow border-rose-100">
                  <CardContent className="p-0">
                    <div className="relative h-64 w-full">
                      <Image
                        src={`/api/files/${image.imageId}`}
                        alt={image.title || "Gallery Image"}
                        fill
                        className="object-contain"
                      />
                    </div>
                    {(image.title || image.description) && (
                      <div className="p-4">
                        {image.title && <h3 className="font-bold text-rose-800">{image.title}</h3>}
                        {image.description && <p className="text-gray-600 text-sm mt-1">{image.description}</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No images found in this category.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
