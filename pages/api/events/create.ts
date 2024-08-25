import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise
      const db = client.db("minisoccer")
      
      const { placeName, mapsLink, date, time, maxKeepers, maxPlayers } = req.body

      const result = await db.collection("events").insertOne({
        placeName,
        mapsLink,
        date,
        time,
        maxKeepers,
        maxPlayers,
        players: [],
        waitingList: []
      })

      res.status(201).json({ message: "Event created successfully", eventId: result.insertedId })
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: "Error creating event" })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}