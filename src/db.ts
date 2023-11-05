import { convertBallsStringToNumberArray } from './helpers'
import { ITicket } from './models'

const PocketBase = require('pocketbase/cjs')

const pb = new PocketBase('http://127.0.0.1:8090')

export const getAllActiveTickets = async () => {
  const activeTickets = await pb.collection('tickets').getFullList({
    filter: 'active = true'
  })

  for (const ticket of activeTickets) {
    ticket.userBalls = convertBallsStringToNumberArray(ticket.userBalls)
  }

  return activeTickets
}

export const addTicketToDB = async (ticket: ITicket) => {
  await pb.collection('tickets').create({
    ticketId: ticket.id,
    playerId: ticket.playerId,
    betPerRound: ticket.betPerRound,
    rounds: ticket.rounds,
    userBalls: ticket.userBalls.join(','),
    startingRound: ticket.startingRound,
    numOfRounds: ticket.numOfRounds,
    timestamp: new Date(),
    active: ticket.active,
    betSum: ticket.betSum
  })
}

export const updateTicket = async (
  recordId: string,
  updatedFieldsObject: any
) => {
  return await pb.collection('tickets').update(recordId, {
    ...updatedFieldsObject
  })
}

export const getTicketById = async (ticketId: string) => {
  return await pb.collection('tickets').getList(1, 1, {
    filter: `ticketId="${ticketId}"`
  })
}
