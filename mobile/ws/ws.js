const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')

class WebSocket {
constructor(password, port, client) {
this.password = password
this.client = client

this.app = express()
this.app.engine('hbs', engine({
extname: '.hbs',
defaultLayout: 'layout',
layoutsDir: __dirname + '/layouts'
}))
this.app.set('views', path.join(__dirname, 'views'))
this.app.set('view engine', 'hbs')
this.app.use(express.static(path.join(__dirname, 'public')))
this.app.use(bodyParser.urlencoded({ extended: false }))
this.app.use(bodyParser.json())

this.registerRoots()

this.server = this.app.listen(port, () => {
console.log('WS: Listening on port ' + this.server.address().port)
})
}

checkPassword(_password) {
return (_password == this.password)
}

registerRoots() {
this.app.get('/', (req, res) => {
var _password = req.query.pass

if (!this.checkPassword(_password)) {
res.render('error', { })
return
}
res.render('index', { title: 'DC Bot Webinterface' })
})
}
}

module.exports = WebSocket
