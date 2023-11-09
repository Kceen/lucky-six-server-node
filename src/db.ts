import {
  convertBallsStringToNumberArray,
  convertDBResponseTicketToTicketDTO,
  convertDBResponseUserToUserDTO
} from './helpers'
import { ITicket, ITicketDTO, IUserDTO, TicketStatus } from './models'

const PocketBase = require('pocketbase/cjs')

const pb = new PocketBase('http://127.0.0.1:8090')

export const getAllActiveTickets = async () => {
  const activeTickets = await pb.collection('tickets').getFullList({
    filter: "status = 'PENDING'"
  })

  for (const ticket of activeTickets) {
    ticket.userBalls = convertBallsStringToNumberArray(ticket.userBalls)
  }

  return activeTickets
}

export const addTicketToDB = async (ticket: ITicket) => {
  await pb.collection('tickets').create({
    ticketId: ticket.id,
    user: [ticket.userId],
    betPerRound: ticket.betPerRound,
    rounds: ticket.rounds,
    userBalls: ticket.userBalls.join(','),
    startingRound: ticket.startingRound,
    numOfRounds: ticket.numOfRounds,
    timestamp: new Date(),
    status: TicketStatus.PENDING,
    betSum: ticket.betSum
  })
}

export const updateTicket = async (recordId: string, updatedFieldsObject: Partial<ITicketDTO>) => {
  return await pb.collection('tickets').update(recordId, {
    ...updatedFieldsObject
  })
}

export const getTicketById = async (ticketId: string) => {
  const ticketResponse = await pb.collection('tickets').getList(1, 1, {
    filter: `ticketId="${ticketId}"`,
    expand: 'user'
  })

  if (ticketResponse.totalItems === 0) {
    return undefined
  }

  const ticket = convertDBResponseTicketToTicketDTO(ticketResponse.items[0])

  return ticket
}

export const login = async (username: string, password: string) => {
  try {
    // GET THE USER WITH ALL HIS TICKETS AND USER INFO IN THOSE TICKETS (tickets(user).user)
    const userResponse = await pb
      .collection('users')
      .getFirstListItem(`username="${username}" && password="${password}"`, {
        expand: 'tickets(user).user'
      })

    const user = convertDBResponseUserToUserDTO(userResponse)

    return user
  } catch (error) {
    console.error('---------- LOGIN ATTEMPT FAILED ----------')
    return undefined
  }
}

export const getUserById = async (userId: string) => {
  try {
    const userResponse = await pb
      .collection('users')
      .getOne(userId, { expand: 'tickets(user).user' })
    const user = convertDBResponseUserToUserDTO(userResponse)

    return user
  } catch (error) {
    console.error(`---------- USER NOT FOUND IN DB WITH ID = ${userId} ----------`)
    return undefined
  }
}

export const updateUser = async (userId: string, updatedFieldsObject: Partial<IUserDTO>) => {
  const usersResponse = await pb.collection('users').update(userId, {
    ...updatedFieldsObject
  })
  const user = convertDBResponseUserToUserDTO(usersResponse)

  return user
}
