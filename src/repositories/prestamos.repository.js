import { Usuario, Equipo, Prestamo } from '../models/relaciones.js'
import RepositoryBase from './RepositoryBase.js'

const repository = new RepositoryBase(Prestamo)

const incluir = [
  { model: Usuario, attributes: ['id', 'nombre', 'correo'] },
  { model: Equipo, attributes: ['id', 'nombre', 'codigo'] },
]

repository.findAll = async () => {
  try {
    return await Prestamo.findAll({ include: incluir })
  } catch (error) {
    console.log(error)
    return null
  }
}

repository.findOne = async (id) => {
  try {
    return await Prestamo.findOne({ where: { id }, include: incluir })
  } catch (error) {
    console.log(error)
    return null
  }
}

repository.findByUsuario = async (usuarioId) => {
  try {
    return await Prestamo.findAll({ where: { usuarioId }, include: incluir })
  } catch (error) {
    console.log(error)
    return null
  }
}

export default repository