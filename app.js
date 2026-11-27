import express from 'express'
import cors from 'cors'
import { QueryTypes } from 'sequelize'
import sequelize from './src/config/database.js'

import authRouter from './src/routes/auth.routes.js'
import equiposRouter from './src/routes/equipos.routes.js'
import prestamosRouter from './src/routes/prestamos.routes.js'
import usuariosRouter from './src/routes/usuarios.routes.js'
import { verificarToken } from './src/middlewares/auth.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ message: 'HEALTHY', code: 200 }))

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate()
    const tablas = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
      { type: QueryTypes.SELECT }
    )
    res.json({ db: 'conectada', tablas: tablas.map((t) => t.table_name) })
  } catch (e) {
    res.status(500).json({ db: 'error', detalle: e.message })
  }
})

// Público: registro y login
app.use('/auth', authRouter)

// Protegido: hace falta sesión (y luego cada ruta filtra por rol)
app.use('/equipos', verificarToken, equiposRouter)
app.use('/prestamos', verificarToken, prestamosRouter)
app.use('/usuarios', verificarToken, usuariosRouter)

export default app