import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { Event } from '@/lib/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise
      const db = client.db("minisoccer")
      
      const { id } = req.query

      const event = await db.collection<Event>("events").findOne({ _id: new ObjectId(id as string) })

      if (!event) {
        return res.status(404).json({ message: "Event not found" })
      }

      res.status(200).json(event)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: "Error fetching event" })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}