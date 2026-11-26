require('dotenv').config()
const express = require('express')

const app = express()
app.use(express.json())

app.get('/', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`API escuchando en el puerto ${PORT}`))