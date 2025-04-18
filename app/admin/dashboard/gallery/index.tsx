"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Trash2, Upload } from "lucide-react"
import FileUpload from "@/components/ui/file-upload"

// Define TypeScript interfaces
interface GalleryImage {
  _id: string;
  imageId: string;
  title?: string;
}

interface Category {
  _id?: string;
  id?: string;
  name: string;
  images: GalleryImage[];
}

interface FileData {
  id: string;
  filename: string;
  url: string;
}

export default function GalleryPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "days-celebrations", name: "Days & Celebrations", images: [] },
    { id: "festivals", name: "Festivals", images: [] },
    { id: "testimonials", name: "Testimonials", images: [] },
    { id: "college-glimpses", name: "College Glimpses", images: [] },
  ])
  const [activeCategory, setActiveCategory] = useState<string>("days-celebrations")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch("/api/gallery/categories")
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data && data.data.length > 0) {
            setCategories(data.data)
            setActiveCategory(data.data[0]._id)
          }
        } else {
          throw new Error("Failed to fetch gallery categories")
        }
      } catch (error) {
        console.error("Error fetching gallery:", error)
        toast({
          title: "Error",
          description: "Failed to load gallery. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGallery()
  }, [toast])

  const handleImageUpload = async (fileData: FileData) => {
    if (!activeCategory) {
      toast({
        title: "Error",
        description: "Please select a category first",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/gallery/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: activeCategory,
          imageId: fileData.id,
          title: fileData.filename,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add image to gallery")
      }

      // Refresh the category data
      const categoryResponse = await fetch(`/api/gallery/categories/${activeCategory}`)
      if (categoryResponse.ok) {
        const data = await categoryResponse.json()

        // Update the categories state with the new image
        setCategories(
          categories.map((cat) =>
            cat._id === activeCategory || cat.id === activeCategory
              ? {
                  ...cat,
                  images: [
                    ...(cat.images || []),
                    {
                      _id: Date.now().toString(), // Temporary ID until we refresh
                      imageId: fileData.id,
                      title: fileData.filename,
                    },
                  ],
                }
              : cat,
          ),
        )
      }

      toast({
        title: "Success",
        description: "Image uploaded to gallery successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await fetch(`/api/gallery/images/${imageId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete image")
      }

      // Update the UI by removing the deleted image
      setCategories(
        categories.map((category) => {
          if (category._id === activeCategory || category.id === activeCategory) {
            return {
              ...category,
              images: category.images.filter((img) => img._id !== imageId),
            }
          }
          return category
        }),
      )

      toast({
        title: "Success",
        description: "Image deleted successfully",
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

  const activeImages = categories.find((cat) => cat._id === activeCategory || cat.id === activeCategory)?.images || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-gray-500">Manage gallery images</p>
        </div>
        <Button asChild className="bg-rose-600 hover:bg-rose-700">
          <Link href="/admin/dashboard/gallery/categories/new">
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <div>
              <CardTitle>Gallery Categories</CardTitle>
              <CardDescription>Manage images in different categories</CardDescription>
            </div>
            <div>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <FileUpload 
                  type="image" 
                  onUploadComplete={handleImageUpload} 
                  maxSizeMB={5} 
                  buttonText="Upload Image" 
                />
              </Button>
            </div>
          </div>
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger
                key={category._id || category.id}
                value={category._id || category.id || ''}
                onClick={() => setActiveCategory(category._id || category.id || '')}
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </CardHeader>
        <CardContent>
          <div className="mt-6">
            {activeImages && activeImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activeImages.map((image) => (
                  <div key={image._id} className="relative group">
                    <div className="relative h-40 rounded-lg overflow-hidden">
                      <img
                        src={`/api/files/${image.imageId}`}
                        alt={image.title || "Gallery image"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteImage(image._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {image.title && <p className="text-xs text-center mt-1 truncate">{image.title}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No images in this category</p>
                <p className="text-sm text-gray-400 mt-2">Upload images using the button above</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
