import { WebSocketServer, WebSocket } from 'ws'
import {
  convertMessageRecieve,
  convertMessageSend,
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
import fs from 'fs'
import mysql from 'mysql2'

const wss = new WebSocketServer({ port: 8080 })

const tickets: ITicket[] = []
const allBalls: number[] = []
let playingBalls: number[] = []
const players: IPlayer[] = []
const gameState: IGameState = {
  round: 1,
  activePlayers: wss.clients.size,
  status: GameStatus.WAITING_FOR_NEXT_ROUND,
}

for (let i = 0; i < 48; i++) {
  allBalls[i] = i + 1
}

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
})

conn.connect(function (err) {
  if (err) throw err
  console.log('Connected!')
})

let intervalId: any = undefined
executeRound()
setInterval(executeRound, 5000)

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
      tickets.push({
        ...message.data,
        date: new Date(),
        id: crypto.randomUUID(),
        startingRound: gameState.round + 1,
        playingBalls: {},
      })
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
  gameState.status = GameStatus.ROUND_IN_PROGRESS

  console.log('round ' + gameState.round + ' started')

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
  playingBalls = allBalls.slice(0, 35)
  let ballIndex = 0

  intervalId = setInterval(() => {
    if (ballIndex === 35) {
      endRound()
    }
    broadcast({ type: GameActions.NEW_BALL, data: playingBalls[ballIndex] })
    ballIndex++
  }, 100)
}

function endRound() {
  console.log('round ' + gameState.round + ' ended')

  gameState.status = GameStatus.WAITING_FOR_NEXT_ROUND
  gameState.round++

  for (const ticket of tickets) {
    ticket.playingBalls[gameState.round] = playingBalls

    // console.log(
    //   `${ticket.id},${ticket.playerId},${
    //     ticket.betPerRound
    //   },${ticket.playingBalls.toString()},${ticket.userBalls},${
    //     ticket.startingRound
    //   },${ticket.numOfRounds},${ticket.date}`
    // )

    if (ticket.startingRound + ticket.numOfRounds === gameState.round + 1) {
      fs.appendFile('db.txt', JSON.stringify(ticket), function (err) {})

      // INSERT INTO MYSQL DB
      let playingNumbersString = ''
      Object.keys(ticket.playingBalls).forEach((key) => {
        playingNumbersString += '[' + ticket.playingBalls[Number(key)] + '],'
      })
      playingNumbersString = playingNumbersString.slice(
        0,
        playingNumbersString.length - 1
      )

      conn.query(
        `INSERT INTO ticket VALUES (?,${ticket.playerId},${ticket.betPerRound},${playingNumbersString},${ticket.userBalls},${ticket.startingRound},${ticket.numOfRounds},${ticket.date});`,
        function (err, results) {
          console.log(results)
        }
      )

      tickets.filter((t) => t.id !== ticket.id)
    }

    let hitCount = 0
    for (let i = 0; i < playingBalls.length; i++) {
      if (ticket.userBalls.includes(playingBalls[i])) {
        hitCount++
        if (hitCount === 6) {
          players
            .find((player) => ticket.playerId === player.id)!
            .ws.send(
              convertMessageSend({
                type: GameActions.PLAYER_WIN,
                data: ticket.betPerRound * stakes[i + 1],
              })
            )
          break
        }
      }
    }
  }

  broadcast({ type: GameActions.ROUND_END })
  broadcast({
    type: GameActions.UPDATE_GAME_STATE,
    data: gameState,
  })
  clearInterval(intervalId)
  return
}

function broadcast(data: IMessage) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(convertMessageSend(data))
    }
  })
}
