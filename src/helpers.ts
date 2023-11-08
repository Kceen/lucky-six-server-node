import { IMessage, ITicketDTO, IUserDTO } from './models'
import QRCode from 'qrcode'

export const stakes: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 10000,
  7: 7500,
  8: 5000,
  9: 2500,
  10: 1000,
  11: 500,
  12: 300,
  13: 200,
  14: 150,
  15: 100,
  16: 90,
  17: 80,
  18: 70,
  19: 60,
  20: 50,
  21: 40,
  22: 30,
  23: 25,
  24: 20,
  25: 15,
  26: 10,
  27: 9,
  28: 8,
  29: 7,
  30: 6,
  31: 5,
  32: 4,
  33: 3,
  34: 2,
  35: 1
}

export const getColorOfBall = (ball: number): string => {
  if ([1, 9, 17, 25, 33, 41].includes(ball)) {
    return 'red'
  }
  if ([2, 10, 18, 26, 34, 42].includes(ball)) {
    return 'green'
  }
  if ([3, 11, 19, 27, 35, 43].includes(ball)) {
    return 'blue'
  }
  if ([4, 12, 20, 28, 36, 44].includes(ball)) {
    return 'purple'
  }
  if ([5, 13, 21, 29, 37, 45].includes(ball)) {
    return 'brown'
  }
  if ([6, 14, 22, 30, 38, 46].includes(ball)) {
    return 'yellow'
  }
  if ([7, 15, 23, 31, 39, 47].includes(ball)) {
    return 'orange'
  }
  if ([8, 16, 24, 32, 40, 48].includes(ball)) {
    return 'black'
  }

  return ''
}

export function shuffle(array: number[]) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

export function convertMessageSend(data: IMessage): string {
  return JSON.stringify(data)
}

export function convertMessageRecieve(data: any): IMessage {
  return JSON.parse(data.toString())
}

export const convertBallsStringToNumberArray = (balls: string) => {
  const ballsStringArray = balls.split(',')
  const ballsNumberArray = []

  for (let i = 0; i < ballsStringArray.length; i++) {
    ballsNumberArray.push(Number(ballsStringArray[i]))
  }

  return ballsNumberArray
}

export const convertDBResponseTicketToTicketDTO = (ticketDB: any) => {
  const ticket: ITicketDTO = {
    id: ticketDB.id,
    ticketId: ticketDB.ticketId,
    betPerRound: ticketDB.betPerRound,
    betSum: ticketDB.betSum,
    rounds: ticketDB.rounds,
    userBalls: convertBallsStringToNumberArray(ticketDB.userBalls),
    startingRound: ticketDB.startingRound,
    numOfRounds: ticketDB.numOfRounds,
    timestamp: new Date(ticketDB.timestamp),
    active: ticketDB.active,
    amountWon: ticketDB.amountWon,
    user: {
      id: ticketDB.expand.user.id,
      username: ticketDB.expand.user.username
    }
  }

  return ticket
}

export const convertDBResponseUserToUserDTO = (userDB: any) => {
  const user: IUserDTO = {
    id: userDB.id,
    username: userDB.username,
    money: userDB.money,
    tickets: userDB.expand['tickets(user)']
      ? userDB.expand['tickets(user)'].map((ticketDB: any) =>
          convertDBResponseTicketToTicketDTO(ticketDB)
        )
      : []
  }

  return user
}

export async function generateQR(text: string) {
  return await QRCode.toDataURL(text)
}
