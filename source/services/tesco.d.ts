type SearchResult = {
    url?: string
    imageUrl: string
    name: string
    price: string
    price2: string
    discount: {
        validUntil: string
        desc: string
    } | null
} | string

export type SearchForPromise = Promise<{ result: SearchResult[] | undefined, fromCache: boolean }>

export function SearchFor(search: string): SearchForPromise