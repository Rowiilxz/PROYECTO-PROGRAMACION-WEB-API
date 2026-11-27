import Usuario from './usuario.js'
import Equipo from './equipo.js'
import Prestamo from './prestamo.js'

Usuario.hasMany(Prestamo, { foreignKey: 'usuarioId' })
Prestamo.belongsTo(Usuario, { foreignKey: 'usuarioId' })

Equipo.hasMany(Prestamo, { foreignKey: 'equipoId' })
Prestamo.belongsTo(Equipo, { foreignKey: 'equipoId' })

export { Usuario, Equipo, Prestamo }