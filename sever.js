import express from 'express'
import sqlite from 'sqlite'
import bodyParser from 'body-parser'
import path from 'path'
// port env or default
const port = process.env.PORT || 3333
// hahahaha
const server = express()
const dbConnection = sqlite.open(path.resolve(__dirname, 'jobify.sqlite'), {
  Promise,
})

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
// create new opportunity
server.post('/admin/create-vaga', async (req, res) => {
  const { title, description } = req.body
  const db = await dbConnection
  await db.run(
    `insert into vaga (title,description) values ('${title}','${description}')`
  )
  res.redirect('vaga')
})
// update opportunity
server.get('/admin/update-opportunity/:id', async (req, res) => {
  const { id } = req.params
  const db = await dbConnection
  const opportunity = await db.get(`select * from vaga where id = '${id}'`)
  console.log(opportunity)
  res.render('admin/updateOpportunity', { opportunity })
})

server.post('/admin/opportunity/:id/update', async (req, res) => {
  const { id } = req.params
  const { title, description } = req.body
  const db = await dbConnection
  await db.run(
    `update vaga set title = '${title}' , description = '${description}' where id= ${id}`
  )
  res.redirect('/admin/vaga')
})
// remove opportunity
server.get('/admin/remove-opportunity/:id', async (req, res) => {
  const { id } = req.params
  const db = await dbConnection
  await db.run(`delete from vaga where id = ${id}`)
  res.redirect('/admin/vaga')
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

server.listen(port, () => {
  console.log('port 3333')
})
