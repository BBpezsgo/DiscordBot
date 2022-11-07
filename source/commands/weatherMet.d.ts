export namespace MET {
    type ResultMain = {
        countyName: string
        alerts: {
            type: string
            degree: string
            title: string | null
            description: string | null
        }[]
    }

    type ResultCounty = {
        kiadva: Date
        alerts: {
            typeIcon: string
            degreeIcon: string
            Name: string | null
        }[]
    }
}

export type Page =
    'Main' |
    'Today' |
    'Tomorrow' |
    'ThirdDay' |
    'FourthDay'

export type CountyDays =
    'Today' |
    'Tomorrow' |
    'ThirdDay' |
    'FourthDay'

export type CountyID  =
    'Baranya' |
    'BacsKiskun' |
    'Bekes' |
    'BorsodAbaujZemplen' |
    'CsongradCsanad' |
    'Fejer' |
    'GyorMosonSopron' |
    'HajduBihar' |
    'Heves' |
    'KomaromEsztergom' |
    'Nograd' |
    'Pest' |
    'Somogy' |
    'SzabolcsSzatmarBereg' |
    'JaszNagykunSzolnok' |
    'Tolna' |
    'Vas' |
    'Veszprem' |
    'Zala'

export function GetMainAlerts(page: Page): Promise<ResultMain[]>
export function GetCountyAlerts(countyID: CountyID, day: CountyDays): Promise<ResultCounty>