export type Result = {
    road: string
    houses: string
    time: string
}

export function Get(): Promise<Result[]>