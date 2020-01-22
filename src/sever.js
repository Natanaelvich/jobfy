import express from 'express'

const server = express()
// init server
server.listen(3333, () => {
  console.log('port 3333')
})
