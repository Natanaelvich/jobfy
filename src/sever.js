import express from 'express'

const server = express()

server.set('view engine', 'ejs')
server.use(express.static('public'))
// init server
server.get('/', (req, res) => {
  res.render('home')
})
server.get('/vaga', (req, res) => {
  res.render('vaga')
})

server.listen(3333, () => {
  console.log('port 3333')
})
