import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { Event } from '@/lib/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise
      const db = client.db("minisoccer")
      
      const { id } = req.query
      const { playerId } = req.body

      const result = await db.collection<Event>("events").updateOne(
        { _id: new ObjectId(id as string) },
        { $pull: { players: { name: playerId } } }
      )

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Player not found or already removed" })
      }

      res.status(200).json({ message: "Player removed successfully" })
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: "Error removing player" })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}