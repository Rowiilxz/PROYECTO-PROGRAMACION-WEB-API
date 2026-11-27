require('dotenv').config()
const express = require('express')

const app = express()
app.use(express.json())

app.get('/', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3000

// Solo abre el puerto al correr en tu PC; en Vercel se importa la app
if (require.main === module) {
  app.listen(PORT, () => console.log(`API escuchando en el puerto ${PORT}`))
}

module.exports = app