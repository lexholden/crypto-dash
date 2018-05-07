const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const firebase = require('./firebase')
const { get } = require('axios')

const app = express()
const { Router } = express
const port = 5000
const api = new Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
api.use(cors())

console.clear()

// Get the user's current preferences
api.get('/preferences', (req, res) => {
  const d = firebase.database().ref().once('value').then(d => {
    let stuff = d.val()
    if (!stuff) { stuff = { symbols: {} } }
    res.json({ symbols: Object.keys(stuff.symbols) })
  })
  // res.json({ user: 'bob' })
})

// Add a new symbol
api.post('/preferences/symbols', (req, res) => {
  const { symbol } = req.body
  firebase.database().ref(`/symbols/${symbol}`).set(true).then(d => {
    res.json({ success: true })
  })
})

// Delete a symbol
api.delete('/preferences/symbols/:symbol', (req, res) => {
  const { symbol } = req.params
  firebase.database().ref(`/symbols/${symbol}`).remove().then(d => {
    res.json({ success: true })
  })
})

// Delete all symbols
api.delete('/preferences/symbols', (req, res) => {
  firebase.database().ref('/symbols').remove().then(d => {
    res.json({ success: true })
  })
})


app.use('/api/v1', api)

app.listen(port, () => console.log(`Listening on port ${port}`))
