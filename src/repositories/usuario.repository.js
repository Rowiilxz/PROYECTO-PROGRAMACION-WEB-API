import { Usuario } from '../models/relaciones.js'
import RepositoryBase from './RepositoryBase.js'

const repository = new RepositoryBase(Usuario)

// Nunca devolvemos la contraseña en las listas
repository.findAll = async () => {
  try {
    return await Usuario.findAll({
      attributes: { exclude: ['password'] },
    })
  } catch (error) {
    console.log(error)
    return null
  }
}

repository.findByCorreo = async (correo) => {
  try {
    return await Usuario.findOne({ where: { correo } })
  } catch (error) {
    console.log(error)
    return null
  }
}

export default repository