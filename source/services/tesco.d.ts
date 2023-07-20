export type SearchResult = {
    products: Product[]
    categories: { name: string, size: number }[]
}

type Product = {
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

export type Response<TResult, TError = any> = FailedResponse<TError> | SuccessfulResponse<TResult>

export type SuccessfulResponse<TResult> = {
    result: TResult
    /** Is it loaded from the cache? */
    cache: boolean
    error?: undefined
}

export type FailedResponse<TError> = {
    result?: undefined
    cache?: undefined
    error: TError
}

export enum SortMode {
    Relevance = 'relevance',
    AZ = 'title-ascending',
    ZA = 'title-descending',
    CheapFirst = 'price-ascending',
    ExpensiveFirst = 'price-descending',
}

export function SearchFor(search: string, page: number = 1, sort: SortMode = SortMode.AZ): Promise<SuccessfulResponse<SearchResult>>