import { WebSocketServer, WebSocket } from 'ws'
import {
  convertMessageRecieve,
  convertMessageSend,
  generateQR,
  shuffle,
  stakes,
} from './helpers'
import {
  GameActions,
  GameStatus,
  IGameState,
  IMessage,
  IPlayer,
  ITicket,
} from './models'
import crypto from 'crypto'
import { startTicketCheckingServer } from './ticketCheckingServer'

const wss = new WebSocketServer({ port: 8080 })

const tickets: ITicket[] = []
const allBalls: number[] = []
let activeBalls: number[] = []
const players: IPlayer[] = []
export const gameState: IGameState = {
  round: 1,
  activePlayers: wss.clients.size,
  status: GameStatus.WAITING_FOR_NEXT_ROUND,
}
const roundTimeMS = 5000
const ballDrawingTimeMS = 100

// INITIALIZE ALL BALLS WITH NUMBER VALUES AND START TICKET CHECKING SERVER
for (let i = 0; i < 48; i++) {
  allBalls[i] = i + 1
}
startTicketCheckingServer()

let intervalId: any = undefined
executeRound()
setInterval(executeRound, roundTimeMS)

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = convertMessageRecieve(data)

    if (message.type === GameActions.PLAYER_JOINED) {
      players.push({ ...message.data, ws })
      gameState.activePlayers = wss.clients.size

      broadcast({
        type: GameActions.UPDATE_GAME_STATE,
        data: gameState,
      })
    }

    if (message.type === GameActions.BET) {
      const newTicket = {
        ...message.data,
        date: new Date(),
        id: crypto.randomUUID(),
        startingRound: gameState.round + 1,
        playingBalls: new Map(),
      }
      tickets.push(newTicket)
      generateQR('localhost:3001/ticketStatus/id=' + newTicket.id).then(
        (qrCode) => {
          console.log('localhost:3001/ticketStatus/id=' + newTicket.id)
          ws.send(
            convertMessageSend({
              type: GameActions.BET_SUCCESS_RESPONSE,
              data: qrCode,
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
  console.log('round ' + gameState.round + ' started')

  gameState.status = GameStatus.ROUND_IN_PROGRESS

  broadcast({
    type: GameActions.ROUND_START,
  })
  broadcast({
    type: GameActions.UPDATE_GAME_STATE,
    data: gameState,
  })

  if (intervalId) {
    clearInterval(intervalId)
  }

  shuffle(allBalls)
  activeBalls = allBalls.slice(0, 35)
  let ballIndex = 0

  intervalId = setInterval(() => {
    if (ballIndex === 35) {
      endRound()
      return
    }
    broadcast({ type: GameActions.NEW_BALL, data: activeBalls[ballIndex] })
    ballIndex++
  }, ballDrawingTimeMS)
}

function endRound() {
  console.log('round ' + gameState.round + ' ended')

  gameState.status = GameStatus.WAITING_FOR_NEXT_ROUND
  gameState.round++

  for (const ticket of tickets) {
    ticket.playingBalls.set(gameState.round, activeBalls)

    let hitCount = 0
    for (let i = 0; i < activeBalls.length; i++) {
      if (ticket.userBalls.includes(activeBalls[i])) {
        hitCount++
        if (hitCount === 6) {
          let winningPlayer = players.find(
            (player) => ticket.playerId === player.id
          )

          if (winningPlayer) {
            winningPlayer.ws.send(
              convertMessageSend({
                type: GameActions.PLAYER_WIN,
                data: ticket.betPerRound * stakes[i + 1],
              })
            )
          }
          break
        }
      }
    }

    const isTicketExpired =
      ticket.startingRound + ticket.numOfRounds === gameState.round + 1
    if (isTicketExpired) {
      tickets.filter((t) => t.id !== ticket.id)

      // TODO - TICKET NO LONGER ACTIVE, WRITE IT TO DB
    }
  }

  broadcast({ type: GameActions.ROUND_END })
  broadcast({
    type: GameActions.UPDATE_GAME_STATE,
    data: gameState,
  })
  clearInterval(intervalId)
}

function broadcast(data: IMessage) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(convertMessageSend(data))
    }
  })
}
