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
            typeIcon: Icon
            degreeIcon: 'w1.gif' | 'w2.gif' | 'w3.gif'
            Name: string | null
        }[]
    }

    type ResultMainWeather = {
        time: string
        time_stamp: number
        temp: number
        wind_dir: string
        wind_sp: number
        gust: number
        pressure: number
        humidity: number
        precipitation: number
    }

    type ResultSnowReport = {
        location: string
        depth: number | 'patches'
    }[]
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

export type Icon =
    'ts1.gif' |
    'ts2.gif' |
    'ts3.gif' |

    'rainstorm1.gif' |
    'rainstorm2.gif' |
    'rainstorm3.gif' |

    'hotx1.gif' |
    'hotx2.gif' |
    'hotx3.gif' |
    
    'wind1.gif' |
    'wind2.gif' |
    'wind3.gif' |
    
    'fzra1.gif' |
    'fzra2.gif' |
    'fzra3.gif' |
    
    'snowdrift1.gif' |
    'snowdrift2.gif' |
    'snowdrift3.gif' |
    
    'rain1.gif' |
    'rain2.gif' |
    'rain3.gif' |
    
    'snow1.gif' |
    'snow2.gif' |
    'snow3.gif' |
    
    'fog1.gif' |
    'fog2.gif' |
    'fog3.gif' |
    
    'coldx1.gif' |
    'coldx2.gif' |
    'coldx3.gif'

export const Descriptions: {
    [icon: string]: {
        icon: string
        description: string
    }?
}
    
export function GetMainAlerts(page: Page): Promise<MET.ResultMain[]>
export function GetCountyAlerts(countyID: CountyID, day: CountyDays): Promise<MET.ResultCounty>
export function GetMainWeather(forceDownload = false): Promise<MET.ResultMainWeather>
export function GetSnowReport(forceDownload = false): Promise<MET.ResultSnowReport>
