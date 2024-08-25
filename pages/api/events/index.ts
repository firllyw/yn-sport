import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { Event } from '@/lib/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise
      const db = client.db("minisoccer")
      
      const events = await db.collection<Event>("events").find({}).toArray()

      res.status(200).json(events)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: "Error fetching events" })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}