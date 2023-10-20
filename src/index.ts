import { WebSocketServer, WebSocket } from 'ws'
import {
  convertMessageRecieve,
  convertMessageSend,
  generateQR,
  getColorOfBall,
  shuffle,
  stakes
} from './helpers'
import {
  GameActions,
  GameStatus,
  IGameState,
  IMessage,
  IPlayer,
  ITicket,
  ITicketRound
} from './models'
import crypto from 'crypto'
import { startTicketCheckingServer } from './ticketCheckingServer'
import { addTicketToDB, getAllActiveTickets, updateTicket } from './db'

const wss = new WebSocketServer({ port: 8080 })

const allBalls: number[] = []
let activeBalls: number[] = []
const players: IPlayer[] = []
let currentBallIndex = 0

const ballDrawingTimeMS = 1000
const roundTimeMS = ballDrawingTimeMS * 35
const pauseTimeMS = 20000

export const gameState: IGameState = {
  round: 0,
  activePlayers: wss.clients.size,
  status: GameStatus.WAITING_FOR_NEXT_ROUND,
  activeBalls: [],
  pauseTime: pauseTimeMS / 1000,
  timeRemaining: 0,
  firstBallColor: '',
  firstBallEven: false,
  firstBallHigherThan24: false
}

// INITIALIZE ALL BALLS WITH NUMBER VALUES AND START TICKET CHECKING SERVER
for (let i = 0; i < 48; i++) {
  allBalls[i] = i + 1
}
startTicketCheckingServer()

let intervalId: any = undefined
executeRound()
setInterval(executeRound, roundTimeMS + pauseTimeMS)

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = convertMessageRecieve(data)

    if (message.type === GameActions.PLAYER_JOINED) {
      players.push({ ...message.data, ws })
      gameState.activePlayers = wss.clients.size

      broadcast({
        type: GameActions.UPDATE_GAME_STATE,
        data: gameState
      })
    }

    if (message.type === GameActions.BET) {
      const test = message.data.betPerRound * message.data.numOfRounds

      const newTicket: ITicket = {
        ...message.data,
        timestamp: new Date(),
        id: crypto.randomUUID(),
        startingRound: gameState.round + 1,
        rounds: [],
        active: true,
        betSum: message.data.betPerRound * message.data.numOfRounds
      }

      addTicketToDB(newTicket)

      generateQR('localhost:3000/ticket-status?id=' + newTicket.id).then(
        (qrCode) => {
          ws.send(
            convertMessageSend({
              type: GameActions.BET_SUCCESS_RESPONSE,
              data: qrCode
            })
          )
        }
      )
    }
  })

  ws.on('close', () => {
    gameState.activePlayers--
    players.filter((player) => {
      player.ws !== ws
    })
  })
})

function executeRound() {
  gameState.round++
  console.log('round ' + gameState.round + ' started')

  gameState.status = GameStatus.ROUND_IN_PROGRESS
  gameState.activeBalls = []

  broadcast({
    type: GameActions.UPDATE_GAME_STATE,
    data: gameState
  })

  if (intervalId) {
    clearInterval(intervalId)
  }

  shuffle(allBalls)
  activeBalls = allBalls.slice(0, 35)
  currentBallIndex = 0

  intervalId = setInterval(() => {
    if (currentBallIndex === 35) {
      endRound()
      return
    }

    if (currentBallIndex === 0) {
      gameState.firstBallHigherThan24 =
        activeBalls[currentBallIndex] > 24 ? true : false
      gameState.firstBallEven = activeBalls[currentBallIndex] % 2 === 0
      gameState.firstBallColor = getColorOfBall(activeBalls[currentBallIndex])
    }

    gameState.activeBalls.push(activeBalls[currentBallIndex])

    broadcast({
      type: GameActions.UPDATE_GAME_STATE,
      data: gameState
    })

    broadcast({
      type: GameActions.NEW_BALL,
      data: gameState.activeBalls[gameState.activeBalls.length - 1]
    })

    currentBallIndex++
  }, ballDrawingTimeMS)
}

async function endRound() {
  gameState.status = GameStatus.WAITING_FOR_NEXT_ROUND

  broadcast({
    type: GameActions.UPDATE_GAME_STATE,
    data: gameState
  })

  let activeTickets = await getAllActiveTickets()

  for (const ticket of activeTickets) {
    const isTicketExpired =
      ticket.startingRound + ticket.numOfRounds === gameState.round + 1

    const isTicketNotYetInPlay = ticket.startingRound > gameState.round

    if (isTicketNotYetInPlay) {
      continue
    }

    const round: ITicketRound = {
      amountWon: 0,
      balls: activeBalls,
      number: gameState.round,
      status: 'LOSE'
    }

    let hitCount = 0
    for (let i = 0; i < activeBalls.length; i++) {
      if (ticket.userBalls.includes(activeBalls[i])) {
        hitCount++
        if (hitCount === 6) {
          round.amountWon = ticket.betPerRound * stakes[i + 1]
          round.status = 'WIN'
          break
        }
      }
    }
    const newRounds = [...ticket.rounds, round]
    await updateTicket(ticket.id, {
      rounds: newRounds,
      amountWon: newRounds.reduce((sum: number, round: ITicketRound) => {
        return sum + round.amountWon
      }, 0)
    })

    if (isTicketExpired) {
      await updateTicket(ticket.id, {
        active: false
      })
      continue
    }
  }

  console.log('round ' + gameState.round + ' ended')

  let timeRemaining = pauseTimeMS / 1000 - 1
  const timeRemainingIntervalId = setInterval(() => {
    gameState.timeRemaining = timeRemaining
    broadcast({
      type: GameActions.UPDATE_GAME_STATE,
      data: gameState
    })
    timeRemaining--
    if (timeRemaining < 0) {
      clearInterval(timeRemainingIntervalId)
    }
  }, 1000)

  clearInterval(intervalId)
}

function broadcast(data: IMessage) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(convertMessageSend(data))
    }
  })
}
