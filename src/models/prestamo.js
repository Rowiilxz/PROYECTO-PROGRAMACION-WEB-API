import sequelize from '../config/database.js'
import { DataTypes } from 'sequelize'

const Prestamo = sequelize.define('prestamo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fechaInicio: { type: DataTypes.DATE, allowNull: false },
  fechaDevolucion: { type: DataTypes.DATE },
  estado: {
    type: DataTypes.ENUM('pendiente', 'activo', 'devuelto', 'rechazado'),
    defaultValue: 'pendiente',
  },
})

export default Prestamo