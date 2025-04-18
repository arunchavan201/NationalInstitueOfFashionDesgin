import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Download, Info } from "lucide-react"
import clientPromise from "@/lib/mongodb"

async function getAcademicCalendars() {
  try {
    const client = await clientPromise
    const db = client.db("fashion_institute")

    const calendars = await db.collection("academic_calendars").find({}).sort({ createdAt: -1 }).toArray()
    return JSON.parse(JSON.stringify(calendars))
  } catch (error) {
    console.error("Error fetching academic calendars:", error)
    return []
  }
}

export default async function AcademicCalendarPage() {
  const calendars = await getAcademicCalendars()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Academic Calendar</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
        
          <p className="text-gray-700 mb-6">
            The academic calendar provides important dates and schedules for the academic year, including:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>Semester start and end dates</li>
            <li>Examination schedules</li>
            <li>Holiday and vacation periods</li>
            <li>Events and workshops</li>
            <li>Project submission deadlines</li>
            <li>Result announcements</li>
          </ul>
          <p className="text-gray-700">
            Students are advised to regularly check the academic calendar for any updates or changes to the schedule.
          </p>
        </div>

        <div className="relative h-[300px] rounded-lg overflow-hidden shadow-lg">
          <img
            src="/placeholder.svg?height=300&width=500&text=Academic Calendar"
            alt="Academic Calendar"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {calendars && calendars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calendars.map((calendar:any) => (
            <Card key={calendar._id} className="hover:shadow-lg transition-shadow border-rose-100">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <Calendar className="h-12 w-12 text-rose-600 mb-4" />
                <h3 className="font-semibold mb-2 text-rose-800">{calendar.title}</h3>
                {calendar.academicYear && (
                  <p className="text-sm text-gray-500 mb-4">Academic Year: {calendar.academicYear}</p>
                )}
                <p className="text-sm text-gray-500 mb-6">
                  Added on {new Date(calendar.createdAt).toLocaleDateString()}
                </p>
                <Button asChild className="mt-auto bg-rose-600 hover:bg-rose-700">
                  <a href={`/api/files/${calendar.fileId}`} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" /> Download Calendar
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Academic Calendars Available</h3>
          <p className="text-gray-500">
            The academic calendar documents will be uploaded soon. Please check back later.
          </p>
        </div>
      )}

      <div className="mt-12 flex gap-6 flex-col md:flex-row">
        <Card className="flex-1 hover:shadow-lg transition-shadow border-rose-100">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Info className="h-5 w-5 text-rose-600 mr-2" />
              <h3 className="font-semibold text-rose-800">Important Notice</h3>
            </div>
            <p className="text-gray-700 mb-4">
              The academic calendar is subject to change. Any changes will be communicated through official channels and
              the updated calendar will be uploaded here.
            </p>
          </CardContent>
        </Card>

        <Card className="flex-1 hover:shadow-lg transition-shadow border-rose-100">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Info className="h-5 w-5 text-rose-600 mr-2" />
              <h3 className="font-semibold text-rose-800">Contact Information</h3>
            </div>
            <p className="text-gray-700 mb-4">
              For any queries regarding the academic calendar, please contact the Academic Office:
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> academic@nifd.edu
              <br />
              <span className="font-medium">Phone:</span> +91 9974469124
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
