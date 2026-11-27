import app from './app.js'
import sequelize from './src/config/database.js'
import './src/models/relaciones.js'

async function main() {
  try {
    await sequelize.sync({ alter: true })
    console.log('Modelos registrados:', Object.keys(sequelize.models))
    console.log('Base de datos sincronizada!')

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log('Aplicación ejecutándose en el puerto ' + PORT)
    })
  } catch (error) {
    console.log(error)
  }
}

main()