class WSCMessageEvent extends Event {
    constructor(type, data) {
        super(type)
        this.data = data
    }
}

class WSC extends EventTarget {
    constructor() {
        super()

        this.URL = 'ws://' + window.location.host + '/'
        this.WS = new WebSocket(this.URL)
        
        this.WS.addEventListener('open', function(e) {
            console.log('[WS]: Open')
        })
        
        const self = this
        this.WS.addEventListener('message', function(e) {
            if (!e) { return }
            // console.log('[WS]: Message from server: ' + e.data, e)
            const data = JSON.parse(e.data)
            if (!data.type) { return }
            if (typeof data.type !== 'string') { return }
            const v = self.dispatchEvent(new CustomEvent(data.type, { detail: data.data }))
        })
        
        this.WS.addEventListener('error', function(e) {
            console.error('[WS]: Error', e)
        })
        
        this.WS.addEventListener('close', function(e) {
            console.log('[WS]: Closed', e)
        })
    }
}

window.WSC = function() { return new WSC() }