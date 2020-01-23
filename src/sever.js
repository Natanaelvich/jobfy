import express from 'express'
import sqlite from 'sqlite'
import bodyParser from 'body-parser'

const server = express()
const dbConnection = sqlite.open('jobify.sqlite', { Promise })

server.set('view engine', 'ejs')
server.use(express.static('public'))
server.use(bodyParser.urlencoded({ extended: true }))
// init server
server.get('/', async (req, res) => {
  const db = await dbConnection
  const vagas = await db.all('select * from vaga')
  res.render('home', {
    vagas,
  })
})

server.get('/vaga/:id', async (req, res) => {
  const { id } = req.params

  const db = await dbConnection
  const vaga = await db.run(`select * from vaga where id=${id}`)

  res.render('vaga', { vaga })
})

server.get('/admin', (req, res) => {
  res.render('admin/home')
})

server.get('/admin/vaga', async (req, res) => {
  const db = await dbConnection
  const vagas = await db.all('select * from vaga')
  res.render('admin/vaga', { vagas })
})
// create new vaga
server.post('/admin/create-vaga', async (req, res) => {
  const { title, description } = req.body
  const db = await dbConnection
  await db.all(
    `insert into vaga (title,description) values ('${title}','${description}')`
  )
  res.redirect('vaga')
})
// remove opportunity
server.get('/admin/remove-opportunity/:id', async (req, res) => {
  const { id } = req.params
  const db = await dbConnection
  await db.all(`delete from vaga where id = ${id}`)
  res.redirect('vaga')
})

const init = async () => {
  const db = await dbConnection
  await db.run(
    'create table if not exists vaga(' +
      'id INTEGER PRIMARY KEY,  ' +
      'title TEXT,' +
      'description TEXT' +
      ' )'
  )
}
init()

server.listen(3333, () => {
  console.log('port 3333')
})
