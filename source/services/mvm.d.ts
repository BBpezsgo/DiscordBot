export type Result = {
    road: string
    houses: string
    time: string
}

export function Get(statesManager: import('../functions/statesManager').StatesManager): Promise<Result[]>