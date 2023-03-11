// @ts-check

class Parser {
    constructor(/** @type {string} */ text) {
        /** @type {import('./content-parser').ParserElement[]} */
        this.result = [{
            type: 'TEXT',
            data: text,
        }]

        this.Parse(
            /<@![0-9]{18}>/g,
            'USER',
            3, 1)
        
        this.Parse(
            /<#[0-9]{18}>/g,
            'CHANNEL',
            2, 1)
        
        this.Parse(
            /<@&[0-9]{18}>/g,
            'ROLE',
            3, 1)
        
        this.Parse(
            /<:[a-zA-Z]*:[0-9]{18}>/g,
            'EMOJI')
        
        this.Parse(
            /@(everyone|here)/g,
            'PING')
        
        this.Parse(
            /@([a-zA-Z ]+)/g,
            'PING')
        
        this.Parse(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=\!]*)/g,
            'URL')
        
        this.Parse(
            /\n/g,
            'BR')
        
        this.Parse(
            /\*\*[^\*]+\*\*/g,
            'BOLD',
            2, 2)
        
        this.Parse(
            /\*[^\*]+\*/g,
            'ITALIC',
            1, 1)
        
        this.Parse(
            /\`[^\`]+\`/g,
            'SMALLCODE',
            1, 1)
        
        this.Parse(
            /\|\|[^\|]+\|\|/g,
            'SPOILER',
            2, 2)
        
        this.Parse(
            /^>[^\n]*/g,
            'BLOCK',
            1, 0)
        
        for (let i = 0; i < this.result.length; i++) {
            if (this.result[i].type === 'BR') continue
            if (this.result[i].type === 'IMG') continue
            if (this.result[i].type === 'VIDEO') continue
            if (this.result[i].type === 'CHANNEL') continue
            if (this.result[i].type === 'EMOJI') continue
            if (this.result[i].type === 'USER') continue
            if (this.result[i].type === 'ROLE') continue
            if (this.result[i].type === 'URL') continue
            if (!this.result[i].data) continue

            this.result[i].data = this.result[i].data.replace(/\\(?!\\)/g, '')
            this.result[i].data = this.result[i].data.replace(/\\\\/g, '\\')
        }
    }

    GetNonparsedElements(/** @type {(element: import('./content-parser').ParserElement) => void} */ parsed, /** @type {(element: import('./content-parser').ParserElement<'TEXT'>) => void} */ nonparsed) {
        for (const element of this.result) {
            if (element.type === 'TEXT') nonparsed({
                type: 'TEXT',
                data: element.data,
                details: element.details,
                attachmentID: element.attachmentID,
            })
            else parsed(element)
        }
    }

    GetMatches(/** @type {string} */ text, /** @type {RegExp} */ regex) {
        if (!text) return []
        const regexResult = text.matchAll(regex)
        /** @type {{value: string, index: number}[]} */
        const result = []
        let endlessSafe = 0
        while (true) {
            /** @type {RegExpMatchArray | undefined} */
            const next = regexResult.next().value
            if (next === undefined) { break }
            result.push({
                value: next[0],
                index: next.index
            })

            endlessSafe += 1
            if (endlessSafe > 1000) {
                throw new Error('Endless Loop!')
            }
        }
        return result
    }
    
    Parse(/** @type {RegExp} */ regex, /** @type {import('./content-parser').ParserElementType} */ type, sliceStart = 0, sliceEnd = 0) {
        /** @type {import('./content-parser').ParserElement[]} */
        const finalResult = []

        this.GetNonparsedElements(x => finalResult.push(x), element => {
            const result = this.GetMatches(element.data, regex)

            if (result.length > 0) {
                var j = 0
                for (let i = 0; i < result.length; i++) {
                    const resItem = result[i]
                    finalResult.push({
                        type: 'TEXT',
                        data: element.data.substring(j, resItem.index)
                    })
                    finalResult.push({
                        type: type,
                        data: resItem.value.substring(sliceStart, resItem.value.length - sliceEnd)
                    })
                    j = resItem.index + resItem.value.length
                }
                finalResult.push({
                    type: 'TEXT',
                    data: element.data.substring(j)
                })
            } else {
                finalResult.push({
                    type: 'TEXT',
                    data: element.data
                })
            }
        })

        this.result = finalResult
    }
}

module.exports = { Parser }