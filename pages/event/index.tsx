import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Event } from '@/lib/types'

export default function PublicEventListPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState('upcoming')
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
      alert('Failed to fetch events. Please try again.')
    }
  }

  const handleViewEvent = (eventId: string) => {
    router.push(`/event/${eventId}`)
  }

  const upcomingEvents = events.filter(event => !event.isFinished)
  const finishedEvents = events.filter(event => event.isFinished)

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Mini Soccer Events</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Matches</TabsTrigger>
          <TabsTrigger value="finished">Finished Matches</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingEvents.map(event => (
            <Card key={event._id.toString()} className="mb-4">
              <CardHeader>
                <CardTitle>{event.placeName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Date: {event.date}</p>
                <p>Time: {event.time}</p>
                <p>Keeper Price: {event.keeperPrice} IDR</p>
                <p>Player Price: {event.playerPrice} IDR</p>
                <Button onClick={() => handleViewEvent(event._id.toString())} className="mt-2">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="finished">
          {finishedEvents.map(event => (
            <Card key={event._id.toString()} className="mb-4">
              <CardHeader>
                <CardTitle>{event.placeName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Date: {event.date}</p>
                <p>Time: {event.time}</p>
                <Button onClick={() => handleViewEvent(event._id.toString())} className="mt-2">
                  View Results
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}