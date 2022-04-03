const express = require ('express')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
    let data_req = new Date()
    console.log(`${data_req.toLocaleTimeString()} - ${req.path}`)
    next()
})

app.use('/', (req, res, next) => {
    res.send('Olá Mundo Simple NPS!')
})

const PORTA = process.env.PORT || 3000
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`)
})