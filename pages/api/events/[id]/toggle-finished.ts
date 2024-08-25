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

      const event = await db.collection<Event>("events").findOne({ _id: new ObjectId(id as string) })

      if (!event) {
        return res.status(404).json({ message: "Event not found" })
      }

      const result = await db.collection<Event>("events").updateOne(
        { _id: new ObjectId(id as string) },
        { $set: { isFinished: !event.isFinished } }
      )

      if (result.modifiedCount === 0) {
        return res.status(400).json({ message: "Event status not changed" })
      }

      res.status(200).json({ message: "Event status toggled successfully" })
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: "Error toggling event status" })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}