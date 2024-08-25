import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Event, Player } from '@/lib/types'
import { withAdminAuth } from '@/components/withAdminAuth'

function ManageEventPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false)
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

  const handleTogglePayment = async (playerId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/events/${id}/toggle-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, hasPaid: !currentStatus }),
      })
      if (!response.ok) {
        throw new Error('Failed to update payment status')
      }
      await fetchEvent()
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Failed to update payment status. Please try again.')
    }
  }

  const handleRemovePlayer = async (playerId: string) => {
    try {
      const response = await fetch(`/api/events/${id}/remove-player`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      })
      if (!response.ok) {
        throw new Error('Failed to remove player')
      }
      await fetchEvent()
    } catch (error) {
      console.error('Error removing player:', error)
      alert('Failed to remove player. Please try again.')
    }
  }

  const handleToggleFinished = async () => {
    try {
      const response = await fetch(`/api/events/${id}/toggle-finished`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to update event status')
      }
      await fetchEvent()
      setIsFinishDialogOpen(false)
    } catch (error) {
      console.error('Error updating event status:', error)
      alert('Failed to update event status. Please try again.')
    }
  }

  if (!event) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  const keepers = event.players.filter(player => player.isKeeper)
  const players = event.players.filter(player => !player.isKeeper)

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Manage Event: {event.placeName}</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Date: {event.date}</p>
          <p>Time: {event.time}</p>
          <p>Payment Deadline: {event.paymentDeadline}</p>
          <p>Keeper Price: {event.keeperPrice} IDR</p>
          <p>Player Price: {event.playerPrice} IDR</p>
          <p>Status: {event.isFinished ? 'Finished' : 'Upcoming'}</p>
          <Dialog open={isFinishDialogOpen} onOpenChange={setIsFinishDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-2">
                {event.isFinished ? 'Mark as Upcoming' : 'Mark as Finished'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogDescription>
                  Are you sure you want to mark this event as {event.isFinished ? 'upcoming' : 'finished'}?
                  This action will change the events status.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsFinishDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleToggleFinished}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="keepers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="keepers">Keepers</TabsTrigger>
              <TabsTrigger value="players">Players</TabsTrigger>
            </TabsList>
            <TabsContent value="keepers">
              <ul className="space-y-2">
                {keepers.map((keeper: Player) => (
                  <li key={keeper.name} className="flex items-center justify-between">
                    <span>{keeper.name}</span>
                    <div>
                      <Checkbox
                        checked={keeper.hasPaid}
                        onCheckedChange={() => handleTogglePayment(keeper.name, keeper.hasPaid)}
                        className="mr-2"
                      />
                      <Button onClick={() => handleRemovePlayer(keeper.name)} variant="destructive" size="sm">
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="players">
              <ul className="space-y-2">
                {players.map((player: Player) => (
                  <li key={player.name} className="flex items-center justify-between">
                    <span>{player.name}</span>
                    <div>
                      <Checkbox
                        checked={player.hasPaid}
                        onCheckedChange={() => handleTogglePayment(player.name, player.hasPaid)}
                        className="mr-2"
                      />
                      <Button onClick={() => handleRemovePlayer(player.name)} variant="destructive" size="sm">
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Waiting List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {event.waitingList.map((player: Player) => (
              <li key={player.name}>{player.name} ({player.isKeeper ? 'Keeper' : 'Player'})</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default withAdminAuth(ManageEventPage)