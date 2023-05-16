import express from 'express'
import { gameState } from './index'

export function startTicketCheckingServer() {
  const ticketCheckingServer = express()

  ticketCheckingServer.get('/', function (req, res) {
    res.send('Round ' + gameState.round)
  })

  ticketCheckingServer.listen(3001)
}
