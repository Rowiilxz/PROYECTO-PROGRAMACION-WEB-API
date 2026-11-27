import sequelize from '../config/database.js'
import { DataTypes } from 'sequelize'

const Usuario = sequelize.define('usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: {
    type: DataTypes.ENUM('estudiante', 'profesor', 'encargado'),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'activo'),
    defaultValue: 'activo',
  },
})

export default Usuario