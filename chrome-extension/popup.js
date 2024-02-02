'use strict'

let key = null
function GetKey() {
  return new Promise((resolve, reject) => {
    fetch('/key.json')
      .then((res) => {
        res.json()
          .then(resolve)
          .catch(reject)
      })
      .catch(reject)
  })
}
GetKey().then(k => key = k)

function SetLabelText(id, text) {
  document.getElementById('lbl-' + id).innerText = text
}

function OnButtonClick(id, callback) {
  /** @type {HTMLButtonElement} */
  const btn = document.getElementById('btn-' + id)
  btn.addEventListener('click', (e) => { callback() })
}

function DisableButton(id) {
  document.getElementById('btn-' + id).classList.add('disabled')
}

function EnableButton(id) {
  document.getElementById('btn-' + id).classList.remove('disabled')
}

function HttpRequest(url, method) {
  return new Promise((resolve, reject) => {
    console.log('HTTP', method, url)
    const req = new XMLHttpRequest()
    req.onreadystatechange = (e) => {
      if (req.readyState !== 4) return
      if (req.status !== 200) {
        reject('HTTP ' + req.status + ': ' + req.statusText)
        return
      }
      resolve(req.response)
    }
    req.onerror = (e) => { reject('HTTP Error') }
    req.ontimeout = (e) => { reject('HTTP Timeout') }
    req.open(method, url)
    try {
      req.send()
    } catch (error) {
      if (error instanceof DOMException) {
        reject(error.name + ': ' + error.message)
      } else if (error instanceof Error) {
        reject(error.name + ': ' + error.message)
      } else {
        reject(error)
      }
    }
  })
}

function Post(url) {
  return new Promise((resolve, reject) => {
    HttpRequest(url, 'POST')
      .then(resolve)
      .catch(reject)
  })
}

function Get(url) {
  return new Promise((resolve, reject) => {
    HttpRequest(url, 'GET')
      .then(resolve)
      .catch(reject)
  })
}

OnButtonClick('restart', () => {
  StopRefreshing()
  DisableButton('restart')
  DisableButton('terminate')
  Post('http://192.168.1.100:5665/Process/Restart?key=' + key)
    .finally(Refreshing)
})

OnButtonClick('terminate', () => {
  StopRefreshing()
  DisableButton('restart')
  DisableButton('terminate')
  Post('http://192.168.1.100:5665/Process/Exit?key=' + key)
    .finally(Refreshing)
})

/** @type {NodeJS.Timer | null} */
let refreshingTimer = null

function StopRefreshing() {
  if (refreshingTimer) {
    clearInterval(refreshingTimer)
    refreshingTimer = null
  }
}

let GetDataPending = false
function Refreshing() {
  if (refreshingTimer) { StopRefreshing() }
  return setInterval(() => {
    if (GetDataPending) { return }
    GetDataPending = true
    Get('http://192.168.1.100:5665/dcbot/status.json?key=' + key)
      .then(status_ => {
        const status = JSON.parse(status_)
        // const x = {"heartbeat":1,"hello":0,"loadingProgressText":"Betöltés...","botLoadingState":"Ready","botLoaded":true,"botReady":false,"Shard_IsLoading":false,"Shard_LoadingText":"'Heartbeat' küldése","Shard_Error":"","uptime":"0:02:45","shardState":"Ready","ws":{"ping":"127","status":"Ready"},"systemUptime":"2:34:37"}
        // document.body.innerText = JSON.stringify(status)
        SetLabelText('ready-time', status.readyTime)
        SetLabelText('uptime', status.uptime)
        SetLabelText('status-bot', status.botLoadingState)
        SetLabelText('status-ws', status.ws?.status)
        SetLabelText('status-shard', status.shardState)
        SetLabelText('ping', status.ws?.ping)

        EnableButton('restart')
        EnableButton('terminate')

        document.getElementById('html-error').style.display = 'none'
        GetDataPending = false
      })
      .catch(error => {
        document.getElementById('html-error').style.display = 'block'
        document.getElementById('html-error').innerText = error
        GetDataPending = false
      })
  }, 500)
}

refreshingTimer = Refreshing()
