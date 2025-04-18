"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { User, Mail, Briefcase, BookOpen, Award } from "lucide-react"

export function FacultyTabs({ teaching, nonTeaching }: { teaching: any[]; nonTeaching: any[] }) {
  const [activeTab, setActiveTab] = useState("teaching")

  return (
    <div className="space-y-10">
      <Tabs 
        defaultValue="teaching" 
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="flex justify-center mb-8">
          <TabsList className="bg-white/60 backdrop-blur-sm shadow-md border border-rose-100">
            <TabsTrigger 
              value="teaching"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              Teaching Faculty
            </TabsTrigger>
            <TabsTrigger 
              value="nonTeaching"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              Administrative Staff
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="teaching" className="mt-6">
          {teaching && teaching.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teaching.map((member) => (
                <FacultyCard key={member._id} member={member} isTeaching={true} />
              ))}
            </div>
          ) : (
            <EmptyState message="No teaching faculty members found." />
          )}
        </TabsContent>

        <TabsContent value="nonTeaching" className="mt-6">
          {nonTeaching && nonTeaching.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nonTeaching.map((member) => (
                <FacultyCard key={member._id} member={member} isTeaching={false} />
              ))}
            </div>
          ) : (
            <EmptyState message="No administrative staff members found." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FacultyCard({ member, isTeaching }: { member: any; isTeaching: boolean }) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none group">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardContent className="p-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-300/20 to-pink-300/20"></div>
          <div className="flex flex-col items-center p-8 relative z-10">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
              <Image
                src={member.imageId ? `/api/files/${member.imageId}` : "/placeholder.svg?height=128&width=128"}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800">{member.name}</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-pink-500 my-2"></div>
            <p className="text-rose-700 text-center font-medium">{member.designation}</p>
            {member.department && <p className="text-gray-600 text-center">{member.department}</p>}
          </div>
        </div>

        <div className="p-6 bg-white">
          {isTeaching && (
            <>
              {member.qualification && (
                <div className="flex items-center mb-3">
                  <Award className="h-4 w-4 text-rose-600 mr-2" />
                  <p className="text-sm text-gray-700">{member.qualification}</p>
                </div>
              )}
              {member.experience && (
                <div className="flex items-center mb-3">
                  <Briefcase className="h-4 w-4 text-rose-600 mr-2" />
                  <p className="text-sm text-gray-700">{member.experience}</p>
                </div>
              )}
              {member.specialization && (
                <div className="flex items-center mb-3">
                  <BookOpen className="h-4 w-4 text-rose-600 mr-2" />
                  <p className="text-sm text-gray-700">{member.specialization}</p>
                </div>
              )}
            </>
          )}
          
          {member.email && (
            <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
              <Mail className="h-4 w-4 text-rose-600 mr-2" />
              <a href={`mailto:${member.email}`} className="text-rose-600 hover:text-pink-700 hover:underline transition-colors">
                {member.email}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-600 mb-2">No Data Available</h3>
      <p className="text-gray-500 max-w-md mx-auto">{message}</p>
    </div>
  )
}
