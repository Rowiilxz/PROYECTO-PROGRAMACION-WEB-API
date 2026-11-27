import express from 'express'
import cors from 'cors'
import sequelize from './src/config/database.js'
import { QueryTypes } from 'sequelize'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ message: 'HEALTHY', code: 200 }))

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate()

    const base = await sequelize.query('SELECT current_database() AS base', {
      type: QueryTypes.SELECT,
    })
    const tablas = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
      { type: QueryTypes.SELECT }
    )

    res.json({
      db: 'conectada',
      host: new URL(process.env.DATABASE_URL).host,
      base: base[0].base,
      tablas: tablas.map((t) => t.table_name),
    })
  } catch (e) {
    res.status(500).json({ db: 'error', detalle: e.message })
  }
})

export default app