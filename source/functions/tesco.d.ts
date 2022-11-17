export namespace TescoResult {
    type SearchResult = {
        url: string
        imageUrl: string
        name: string
        price: string
        price2: string
        discount: {
            validUntil: string
            desc: string
        } | undefined
    }
}

export function SearchFor(search: string): Promise<{error:string|undefined;result:TescoResult.SearchResult[]|undefined}>