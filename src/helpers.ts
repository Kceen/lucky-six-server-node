import { IMessage } from './models'
import QRCode from 'qrcode'

export const stakes: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 10000,
  7: 7500,
  8: 5000,
  9: 2500,
  10: 1000,
  11: 500,
  12: 300,
  13: 200,
  14: 150,
  15: 100,
  16: 90,
  17: 80,
  18: 70,
  19: 60,
  20: 50,
  21: 40,
  22: 30,
  23: 25,
  24: 20,
  25: 15,
  26: 10,
  27: 9,
  28: 8,
  29: 7,
  30: 6,
  31: 5,
  32: 4,
  33: 3,
  34: 2,
  35: 1,
}

export function shuffle(array: number[]) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

export function convertMessageSend(data: IMessage): string {
  return JSON.stringify(data)
}

export function convertMessageRecieve(data: any): IMessage {
  return JSON.parse(data.toString())
}

export async function generateQR(text: string) {
  return await QRCode.toDataURL(text)
}
