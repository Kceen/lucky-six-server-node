import { WebSocket } from 'ws'

export interface ITicket {
  id: string
  playerId: string
  betPerRound: number
  playingBalls: Record<number, number[]>
  userBalls: number[]
  startingRound: number
  numOfRounds: number
  date: Date
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
}

export enum GameActions {
  PLAYER_JOINED = 'PLAYER_JOINED',
  NEW_BALL = 'NEW_BALL',
  ROUND_START = 'ROUND_START',
  ROUND_END = 'ROUND_END',
  UPDATE_GAME_STATE = 'UPDATE_GAME_STATE',
  PLAYER_WIN = 'PLAYER_WIN',
  BET = 'BET',
}

export enum GameStatus {
  ROUND_IN_PROGRESS = 'ROUND_IN_PROGRESS',
  WAITING_FOR_NEXT_ROUND = 'WAITING_FOR_NEXT_ROUND',
}
