import { WebSocket } from 'ws'

export interface ITicket {
  id: string
  playerId: string
  betPerRound: number
  betSum: number
  rounds: ITicketRound[]
  userBalls: number[]
  startingRound: number
  numOfRounds: number
  timestamp: Date
  active: boolean
  amountWon: number
}

export interface ITicketRound {
  number: number
  balls: number[]
  status: 'WIN' | 'LOSE'
  amountWon: number
}

export interface IPlayer {
  id: string
  name: string
  ws: WebSocket
}

export interface IMessage {
  type: GameActions
  data?: any
}

export interface IGameState {
  round: number
  activePlayers: number
  status: GameStatus
  activeBalls: number[]
  pauseTime: number
  firstBallHigherThan24: boolean
  firstBallColor: string
  firstBallEven: boolean
}

export enum GameActions {
  PLAYER_JOINED = 'PLAYER_JOINED',
  UPDATE_GAME_STATE = 'UPDATE_GAME_STATE',
  PLAYER_WIN = 'PLAYER_WIN',
  BET = 'BET',
  BET_SUCCESS_RESPONSE = 'BET_SUCCESS_RESPONSE',
  NEW_BALL = 'NEW_BALL',
  TIME_REMAINING = 'TIME_REMAINING'
}

export enum GameStatus {
  ROUND_IN_PROGRESS = 'ROUND_IN_PROGRESS',
  WAITING_FOR_NEXT_ROUND = 'WAITING_FOR_NEXT_ROUND'
}
