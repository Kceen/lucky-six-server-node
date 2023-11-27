import { WebSocket } from 'ws'

export interface ITicket {
  id: string
  userId: string
  betPerRound: number
  betSum: number
  rounds: ITicketRound[]
  userBalls: number[]
  startingRound: number
  numOfRounds: number
  timestamp: Date
  status: TicketStatus
  amountWon: number
}

export interface ITicketDTO {
  id: string
  ticketId: string
  betPerRound: number
  betSum: number
  rounds: ITicketRound[]
  userBalls: number[]
  startingRound: number
  numOfRounds: number
  timestamp: Date
  status: TicketStatus
  amountWon: number
  user: ITicketUserDTO
}

export interface ITicketRound {
  number: number
  balls: number[]
  status: 'WIN' | 'LOSE'
  amountWon: number
}

export interface IPlayer extends IUserDTO {
  ws: WebSocket
}

export interface IUserDTO {
  id: string
  username: string
  money: number
  tickets: ITicketDTO[]
}

export interface ITicketUserDTO {
  id: string
  username: string
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
  firstFiveBallsSum: number
  evenBallsCount: number
  oddBallsCount: number
}

export enum GameActions {
  PLAYER_JOINED = 'PLAYER_JOINED',
  UPDATE_GAME_STATE = 'UPDATE_GAME_STATE',
  UPDATE_USER_STATE = 'UPDATE_USER_STATE',
  PLAYER_WIN = 'PLAYER_WIN',
  BET = 'BET',
  BET_SUCCESS_RESPONSE = 'BET_SUCCESS_RESPONSE',
  BET_FAIL_RESPONSE = 'BET_FAIL_RESPONSE',
  NEW_BALL = 'NEW_BALL',
  TIME_REMAINING = 'TIME_REMAINING',
  LOGIN = 'LOGIN',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAIL = 'LOGIN_FAIL'
}

export enum GameStatus {
  ROUND_IN_PROGRESS = 'ROUND_IN_PROGRESS',
  WAITING_FOR_NEXT_ROUND = 'WAITING_FOR_NEXT_ROUND'
}

export enum TicketStatus {
  PENDING = 'PENDING',
  LOSE = 'LOSE',
  WIN = 'WIN'
}
