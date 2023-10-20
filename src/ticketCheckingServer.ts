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
      const ticketResponse = await getTicketById(req.params.ticketId)
      if (ticketResponse.totalItems === 0) {
        res.sendStatus(404)
      } else {
        const ticket = ticketResponse.items[0]

        ticket.timestamp = new Date(ticket.timestamp)
        ticket.userBalls = ticket.userBalls.split(',')
        ticket.userBalls = ticket.userBalls.map((ballString: any) => {
          return parseInt(ballString)
        })

        res.send(JSON.stringify(ticket))
      }
    }
  )

  ticketCheckingServer.listen(3001)
}
