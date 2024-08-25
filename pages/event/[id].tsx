import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Event, Player } from '@/lib/types'

export default function PublicEventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [newPlayer, setNewPlayer] = useState({ name: '', isKeeper: false })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetchEvent()
    }
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch event')
      }
      const data = await response.json()
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
      alert('Failed to fetch event. Please try again.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setNewPlayer(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/events/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event._id,
          playerName: newPlayer.name,
          isKeeper: newPlayer.isKeeper,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to join event')
      }
      await fetchEvent()
      setNewPlayer({ name: '', isKeeper: false })
      alert('Successfully joined the event!')
    } catch (error) {
      console.error('Error joining event:', error)
      alert('Failed to join event. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!event) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  const keepers = event.players.filter(player => player.isKeeper)
  const players = event.players.filter(player => !player.isKeeper)
  const isEventFull = event.players.length >= event.maxKeepers + event.maxPlayers && event.waitingList.length >= 15

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Event Details: {event.placeName}</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Date: {event.date}</p>
          <p>Time: {event.time}</p>
          <p>
            Location: <a href={event.mapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View on Map</a>
          </p>
          <p>Keeper Price: {event.keeperPrice} IDR</p>
          <p>Player Price: {event.playerPrice} IDR</p>
          <p>Payment Deadline: {event.paymentDeadline}</p>
          <p>Status: {event.isFinished ? 'Finished' : 'Upcoming'}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="keepers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="keepers">Keepers ({keepers.length}/{event.maxKeepers})</TabsTrigger>
              <TabsTrigger value="players">Players ({players.length}/{event.maxPlayers})</TabsTrigger>
            </TabsList>
            <TabsContent value="keepers">
              <ul className="list-disc list-inside">
                {keepers.map((keeper: Player) => (
                  <li key={keeper.name}>{keeper.name}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="players">
              <ul className="list-disc list-inside">
                {players.map((player: Player) => (
                  <li key={player.name}>{player.name}</li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {event.waitingList.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Waiting List</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {event.waitingList.map((player: Player) => (
                <li key={player.name}>{player.name} ({player.isKeeper ? 'Keeper' : 'Player'})</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!event.isFinished && (
        <Card>
          <CardHeader>
            <CardTitle>Join Event</CardTitle>
          </CardHeader>
          <CardContent>
            {isEventFull ? (
              <p className="text-red-500">Sorry, this event is full and the waiting list is closed.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newPlayer.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isKeeper"
                    name="isKeeper"
                    checked={newPlayer.isKeeper}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="isKeeper" className="text-sm font-medium">Sign up as Keeper</Label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Joining...' : 'Join Event'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}