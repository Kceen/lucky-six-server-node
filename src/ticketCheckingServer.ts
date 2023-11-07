import express from 'express'
import { getTicketById } from './db'
import cors from 'cors'

export function startTicketCheckingServer() {
  const ticketCheckingServer = express()

  ticketCheckingServer.use(cors())

  ticketCheckingServer.get('/ticket-status/:ticketId', async function (req, res) {
    const ticket = await getTicketById(req.params.ticketId)
    if (ticket) {
      res.send(JSON.stringify(ticket))
    } else {
      res.sendStatus(404)
    }
  })

  ticketCheckingServer.listen(3001)
}
