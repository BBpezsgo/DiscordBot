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

function Get(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => {
        res.text()
          .then(resolve)
          .catch(reject)
      })
      .catch(reject)
  })
}

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
        // SetLabelText('status-bot', status.botLoadingState)
        // SetLabelText('status-ws', status.ws?.status)
        // SetLabelText('status-shard', status.shardState)

        chrome.action.setBadgeText({ text: '✓' })
        chrome.action.setBadgeBackgroundColor({ color: '#666' })
        GetDataPending = false
      })
      .catch(error => {
        console.log(error)
        chrome.action.setBadgeText({ text: '!' })
        chrome.action.setBadgeBackgroundColor({ color: '#DB4437' })
        GetDataPending = false
      })
  }, 5000)
}

refreshingTimer = Refreshing()
