"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Client-only delete button component
function DeleteButton({ id, setAnnouncements }: { id: string, setAnnouncements: React.Dispatch<React.SetStateAction<any[]>> }) {
  const router = useRouter()
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this announcement?")) return
    try {
      const res = await fetch(`/api/announcements?id=${id}`, { method: "DELETE" })
      const result = await res.json()
      if (result.success) {
        // Update local state to remove the deleted announcement
        setAnnouncements(prev => prev.filter(announcement => announcement._id !== id))
        router.refresh()
      } else {
        alert(result.error || "Failed to delete")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("An error occurred during deletion.")
    }
  }
  return (
    <button onClick={handleDelete} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete</span>
    </button>
  )
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const router = useRouter()
  useEffect(() => {
    // Client components must use a relative URL
    async function loadAnnouncements() {
      try {
        const res = await fetch("/api/announcements", { cache: "no-store" })
        const data = await res.json()
        setAnnouncements(data.data ?? [])
      } catch (error) {
        console.error("Error fetching announcements:", error)
      }
    }
    loadAnnouncements()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-gray-500">Manage announcements displayed on the website</p>
        </div>
        <Button asChild className="bg-rose-600 hover:bg-rose-700">
          <Link href="/admin/dashboard/announcements/new">
            <Plus className="h-4 w-4 mr-2" /> Add Announcement
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
          <CardDescription>
            Announcements are displayed in the marquee on the home page
          </CardDescription>
        </CardHeader>
        <CardContent>
          {announcements && announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 mr-4">
                    <div className="flex items-center">
                      <span className="font-medium">{announcement.text}</span>
                      <span
                        className={`ml-3 px-2 py-1 text-xs rounded-full ${
                          announcement.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {announcement.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {announcement.link && (
                      <a
                        href={announcement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {announcement.link}
                      </a>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Created: {new Date(announcement.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" asChild className="h-8 w-8">
                      <Link href={`/admin/dashboard/announcements/${announcement._id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <DeleteButton id={announcement._id} setAnnouncements={setAnnouncements} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No announcements found</p>
              <Button asChild className="mt-4 bg-rose-600 hover:bg-rose-700">
                <Link href="/admin/dashboard/announcements/new">Create your first announcement</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
