export type SearchResult = {
    id: number
    name: string
    localizedName: string
    availableName: string
    description: string
    sellOffers: number
    sellPrice: number
    buyOrders: number
    buyPrice: number
    meta: number
    removed: number
    craftable: number
    popularity: number
    workbenchRarity: number
    craftingSellSum: number
    craftingBuySum: number
    amount: number
    demandSupplyRatio: number
    margin: number
    roi: number
    craftingMargin: number
    formatDemandSupplyRatio: string
    formatMargin: string
    formatRoi: string
    formatCraftingMargin: string
    craftVsBuy: string
    timestamp: string
    lastUpdateTime: string
    rarityId: number
    rarityName: string
    categoryId: number
    categoryName: string
    typeId: number
    recipeId: number
    typeName: string
    factionNumber: number
    faction: string
    formatBuyPrice: string
    formatSellPrice: string
    formatCraftingSellSum: string
    formatCraftingBuySum: string
    craftingResultAmount: number
    image: string
    imagePath: string
    sortedStats: SearchResultStat[]
}

export type SearchResultStat = {
    key: string
    stat: {
        customClasses: string | null
        type: number
        showProgressBar: boolean
        showPercentage: boolean
        showAddition: boolean
        override: any | null
        name: string
        order: number
        showSubtraction: boolean
    }
    value: number
    displayValue: boolean
}

export function SearchFor(query: string): Promise<SearchResult | null>