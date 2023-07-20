export type Response = {
    /**
     * Status shows the status of your request. If the request was successful then it shows “success”, in case of error it shows “error”. In the case of error a code and message property will be displayed.
     */
    status: 'success' | 'error' | string
    /**
     * The total number of results available for your request.
     */
    totalResults: number
    results: {
        /**
         * The title of the news article
         */
        title: string
        /**
         * URL of the news article
         */
        link: string
        /**
         * The name of the source this article came from.
         */
        source_id: string
        /**
         * Related keywords of the news article
         */
        keywords: string[] | null
        /**
         * The author of the news article
         */
        creator: string[] |null
        /**
         * URL of image present in the news articles
         */
        image_url: string | null
        /**
         * URL of video present in the news articles
         */
        video_url: string | null
        /**
         * A small description of the news article
         */
        description: any
        /**
         * The published date of the news article
         */
        pubDate: string
        /**
         * Full content of the news article
         */
        content: string
        /**
         * The country of the publisher
         */
        country: string[]
        /**
         * The category assigned to the news article by NewsData.io
         */
        category: string[]
        /**
         * The language of the news article
         */
        language: string
    }[]
    /**
     * To go to the next page, copy the next page code (without quote), which can be found at the bottom of the page, and add a new parameter with "page" and paste the next page code API URL: https://newsdata.io/api/1/news?apikey=XXX&q=pizza%20OR%20social&page=Your_next_page_id
     */
    nextPage: string
}

export type Settings = {
    /**
     * Search news articles for specific keywords or phrases present in the news title and content. The value must be URL-encoded and the maximum character limit permitted is 512 characters. Please refer Advanced Search for more details
     */
    Query?: string
    /**
     * Search news articles for specific keywords or phrases present in the news titles only. The value must be URL-encoded.
     * 
     * **Note: qInTitle can't be used with q parameter in the same query.**
     */
    QueryInTitle?: string
    /**
     * Search the news articles from a specific country. You can add up to 5 countries in a single query.
     */
    Country?: string
    /**
     * Search the news articles for a specific category. You can add up to 5 categories in a single query.
     */
    Category?: string
    /**
     * Search the news articles for a specific language. You can add up to 5 languages in a single query.
     */
    Language?: string
    /**
     * Search the news articles for specific domains or news sources. You can add up to 5 domains in a single query.
     */
    Domain?: string
    /**
     * Use page parameter to navigate to the next page.
     */
    Page?: string
}

export type CountryCode =
    'af' |
    'al' |
    'dz' |
    'ao' |
    'ar' |
    'au' |
    'at' |
    'az' |
    'bh' |
    'bd' |
    'bb' |
    'by' |
    'be' |
    'bm' |
    'bt' |
    'bo' |
    'ba' |
    'br' |
    'bn' |
    'bg' |
    'bf' |
    'kh' |
    'cm' |
    'ca' |
    'cv' |
    'ky' |
    'cl' |
    'cn' |
    'co' |
    'km' |
    'cr' |
    'ci' |
    'hr' |
    'cu' |
    'cy' |
    'cz' |
    'dk' |
    'dj' |
    'dm' |
    'do' |
    'cd' |
    'ec' |
    'eg' |
    'sv' |
    'ee' |
    'et' |
    'fj' |
    'fi' |
    'fr' |
    'pf' |
    'ga' |
    'ge' |
    'de' |
    'gh' |
    'gr' |
    'gt' |
    'gn' |
    'ht' |
    'hn' |
    'hk' |
    'hu' |
    'is' |
    'in' |
    'id' |
    'iq' |
    'ie' |
    'il' |
    'it' |
    'jm' |
    'jp' |
    'jo' |
    'kz' |
    'ke' |
    'kw' |
    'kg' |
    'lv' |
    'lb' |
    'ly' |
    'lt' |
    'lu' |
    'mo' |
    'mk' |
    'mg' |
    'mw' |
    'my' |
    'mv' |
    'ml' |
    'mt' |
    'mr' |
    'mx' |
    'md' |
    'mn' |
    'me' |
    'ma' |
    'mz' |
    'mm' |
    'na' |
    'np' |
    'nl' |
    'nz' |
    'ne' |
    'ng' |
    'kp' |
    'no' |
    'om' |
    'pk' |
    'pa' |
    'py' |
    'pe' |
    'ph' |
    'pl' |
    'pt' |
    'pr' |
    'ro' |
    'ru' |
    'rw' |
    'ws' |
    'sm' |
    'sa' |
    'sn' |
    'rs' |
    'sg' |
    'sk' |
    'si' |
    'sb' |
    'so' |
    'za' |
    'kr' |
    'es' |
    'lk' |
    'sd' |
    'se' |
    'ch' |
    'sy' |
    'tw' |
    'tj' |
    'tz' |
    'th' |
    'to' |
    'tn' |
    'tr' |
    'tm' |
    'ug' |
    'ua' |
    'ae' |
    'gb' |
    'us' |
    'uy' |
    'uz' |
    've' |
    'vi' |
    'ye' |
    'zm' |
    'zw'

export async function GetFresh(settings: Settings): Response

