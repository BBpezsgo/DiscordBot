export type Item<T> = {
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
    sortedStats: T
}

export type ItemStats = {
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

export type SearchOptions = {
    /** filters by rarity */
    rarity?: string
    /** filters by category */
    category?: string
    /** filters by factions */
    faction?: string
    /** shows removed items (default false) */
    removedItems?: boolean
    /** shows meta items (default false) */
    metaItems?: boolean
}

export type Recipe = { recipe: IngredientDetailed }
export type RecipeDeep = {
    item: Item<ItemStats[]>
    recipe: {
        recipe: IngredientDeep & { item: Item<ItemStats[]> }
    }
}

export type IngredientDeep = Ingredient<IngredientDeep[]> & {
    ingredientSum: IngredientDeep
    item: Item<null>
}

export type IngredientDetailed = Ingredient<IngredientMinimal[]> & {
    ingredientSum: IngredientMinimal & { isSumRow: true }
    item: Item<ItemStats[]>
}

export type IngredientMinimal = Ingredient<[]> & {
    ingredientSum: null
    item: Item<null>
}

export type Ingredient<T> = {
    id: number
    uniqueId: number
    rootNumber: number
    factionNumber: number
    depth: number
    maxDepth: number
    number: number
    sumBuy: number
    sumSell: number
    sumBuyFormat: string
    sumSellFormat: string
    buyPriceTimesNumber: number
    sellPriceTimesNumber: number
    formatBuyPriceTimesNumber: string
    formatSellPriceTimesNumber: string
    isSumRow: boolean
    parentId: number
    parentUniqueId: number
    parentRecipe: number
    superParentRecipe: number
    ingredients: T
}

export type Market = any[][]

export function GetItems(options: string | SearchOptions): Promise<Item<ItemStats[]>[] | null>
export function GetItem(itemID: number): Promise<Item<ItemStats[]> | null>
export function GetRecipe(itemID: number): Promise<Recipe | null>
export function GetRecipeDeep(itemID: number): Promise<RecipeDeep | null>
export function GetMarket(marketColumn: 'sellprice' | 'buyprice' | 'selloffers' | 'buyorders', itemID: number): Promise<Market | null>