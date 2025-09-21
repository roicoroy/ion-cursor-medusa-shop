import { nanoid } from 'nanoid'

export function numberize(x: any) {
  return Number(x);
}

export function generateId() {
  return nanoid()
}

export function generateIdArgs(args:number) {
  return nanoid(args)
}
