import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/router'
import { withAdminAuth } from '@/components/withAdminAuth'

function CreateEventPage() {
  const [eventDetails, setEventDetails] = useState({
    placeName: '',
    mapsLink: '',
    date: '',
    time: '',
    paymentDeadline: '',
    keeperPrice: 70000,
    playerPrice: 80000,
    maxKeepers: 0,
    maxPlayers: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEventDetails(prev => ({ ...prev, [name]: name.includes('Price') ? parseInt(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
      })
      if (!response.ok) {
        throw new Error('Failed to create event')
      }
      const data = await response.json()
      router.push('/admin/events')
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Create Mini Soccer Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="placeName" className="text-sm font-medium">Place Name</Label>
          <Input
            id="placeName"
            name="placeName"
            value={eventDetails.placeName}
            onChange={handleInputChange}
            required
            className="mt-1 w-full"
          />
        </div>
        <div>
          <Label htmlFor="mapsLink" className="text-sm font-medium">Maps Link</Label>
          <Input
            id="mapsLink"
            name="mapsLink"
            value={eventDetails.mapsLink}
            onChange={handleInputChange}
            required
            className="mt-1 w-full"
          />
        </div>
        <div>
          <Label htmlFor="date" className="text-sm font-medium">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={eventDetails.date}
            onChange={handleInputChange}
            required
            className="mt-1 w-full"
          />
        </div>
        <div>
          <Label htmlFor="time" className="text-sm font-medium">Time</Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={eventDetails.time}
            onChange={handleInputChange}
            required
            className="mt-1 w-full"
          />
        </div>
        <div>
          <Label htmlFor="paymentDeadline" className="text-sm font-medium">Payment Deadline</Label>
          <Input
            id="paymentDeadline"
            name="paymentDeadline"
            type="date"
            value={eventDetails.paymentDeadline}
            onChange={handleInputChange}
            required
            className="mt-1 w-full"
          />
        </div>
        <div>
          <Label htmlFor="keeperPrice" className="text-sm font-medium">Keeper Price (IDR)</Label>
          <Input
            id="keeperPrice"
            name="keeperPrice"
            type="number"
            value={eventDetails.keeperPrice}
            onChange={handleInputChange}
            required
            className="mt-1 w-full"
          />
        </div>
        <div>
          <Label htmlFor="playerPrice" className="text-sm font-medium">Player Price (IDR)</Label>
          <Input
            id="playerPrice"
            name="playerPrice"
            type="number"
            value={eventDetails.playerPrice}
            onChange={handleInputChange}
            required
            className="mt-1 w-full"
          />
        </div>
        <div>
          <Label htmlFor="maxKeepers" className="text-sm font-medium">Maximum Keepers</Label>
          <Input
            id="maxKeepers"
            name="maxKeepers"
            type="number"
            value={eventDetails.maxKeepers}
            onChange={handleInputChange}
            required
            className="mt-1 w-full"
          />
        </div>
        <div>
          <Label htmlFor="maxPlayers" className="text-sm font-medium">Maximum Players</Label>
          <Input
            id="maxPlayers"
            name="maxPlayers"
            type="number"
            value={eventDetails.maxPlayers}
            onChange={handleInputChange}
            required
            className="mt-1 w-full"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Event'}
        </Button>
      </form>
    </div>
  )
}

export default withAdminAuth(CreateEventPage)