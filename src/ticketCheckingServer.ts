import express from 'express'
import { gameState } from './index'
import { getTicketById } from './db'
import cors from 'cors'

export function startTicketCheckingServer() {
  const ticketCheckingServer = express()

  ticketCheckingServer.use(cors())

  ticketCheckingServer.get(
    '/ticket-status/:ticketId',
    async function (req, res) {
      const ticket = await getTicketById(req.params.ticketId)
      res.send(JSON.stringify(ticket))
    }
  )

  ticketCheckingServer.listen(3001)
}
