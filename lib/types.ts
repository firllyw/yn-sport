import { ObjectId } from 'mongodb'

export interface Player {
  name: string
  isKeeper: boolean
  hasPaid: boolean
}

export interface Event {
  _id: ObjectId
  placeName: string
  mapsLink: string
  date: string
  time: string
  paymentDeadline: string
  keeperPrice: number
  playerPrice: number
  maxKeepers: number
  maxPlayers: number
  players: Player[]
  waitingList: Player[]
  isFinished: boolean
}