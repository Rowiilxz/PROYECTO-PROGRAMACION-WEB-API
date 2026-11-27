import sequelize from '../config/database.js'
import { DataTypes } from 'sequelize'

const Equipo = sequelize.define('equipo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
  categoria: { type: DataTypes.STRING },
  descripcion: { type: DataTypes.TEXT },
  estado: {
    type: DataTypes.ENUM('disponible', 'prestado', 'mantenimiento'),
    defaultValue: 'disponible',
  },
})

export default Equipo