import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

interface Player {
  name: string
  isKeeper: boolean
}

interface Event {
  _id: ObjectId
  placeName: string
  mapsLink: string
  date: string
  time: string
  maxKeepers: number
  maxPlayers: number
  players: Player[]
  waitingList: Player[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise
      const db = client.db("minisoccer")
      
      const { eventId, playerName, isKeeper } = req.body

      const event = await db.collection<Event>("events").findOne({ _id: new ObjectId(eventId) })

      if (!event) {
        return res.status(404).json({ message: "Event not found" })
      }

      const newPlayer: Player = { name: playerName, isKeeper }

      if (isKeeper && event.players.filter(p => p.isKeeper).length < event.maxKeepers) {
        await db.collection<Event>("events").updateOne(
          { _id: new ObjectId(eventId) },
          { $push: { players: newPlayer } }
        )
        return res.status(200).json({ message: "Joined as keeper" })
      } else if (!isKeeper && event.players.filter(p => !p.isKeeper).length < event.maxPlayers) {
        await db.collection<Event>("events").updateOne(
          { _id: new ObjectId(eventId) },
          { $push: { players: newPlayer } }
        )
        return res.status(200).json({ message: "Joined as player" })
      } else if (event.waitingList.length < 15) {
        await db.collection<Event>("events").updateOne(
          { _id: new ObjectId(eventId) },
          { $push: { waitingList: newPlayer } }
        )
        return res.status(200).json({ message: "Added to waiting list" })
      } else {
        return res.status(400).json({ message: "Event is full" })
      }
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: "Error joining event" })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}