import repository from '../repositories/usuarios.repository.js'

const limpiar = (u) => ({
  id: u.id,
  nombre: u.nombre,
  correo: u.correo,
  rol: u.rol,
  estado: u.estado,
})

const findAll = async (req, res) => {
  const lista = await repository.findAll()
  if (!lista) return res.status(500).json({ success: false, message: 'Error al listar.' })
  return res.json(lista)
}

// El encargado aprueba a un encargado pendiente
const aprobar = async (req, res) => {
  const usuario = await repository.findOne(req.params.id)
  if (!usuario) return res.status(404).json({ success: false, message: 'No se encontró.' })

  const actualizado = await repository.update({ estado: 'activo' }, req.params.id)
  if (!actualizado) return res.status(400).json({ success: false, message: 'No se pudo aprobar.' })
  return res.json(limpiar(actualizado))
}

const remove = async (req, res) => {
  if (Number(req.params.id) === req.usuario.id) {
    return res.status(400).json({ success: false, message: 'No puedes eliminar tu propia cuenta.' })
  }
  const resultado = await repository.remove(req.params.id)
  if (!resultado) return res.status(404).json({ success: false, message: 'No se encontró.' })
  return res.json(resultado)
}

export default { findAll, aprobar, remove }