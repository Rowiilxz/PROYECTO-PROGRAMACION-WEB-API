import repository from '../repositories/prestamos.repository.js'
import equiposRepository from '../repositories/equipos.repository.js'

// El encargado ve todos los préstamos; los demás, solo los suyos
const findAll = async (req, res) => {
  const lista =
    req.usuario.rol === 'encargado'
      ? await repository.findAll()
      : await repository.findByUsuario(req.usuario.id)

  if (!lista) return res.status(500).json({ success: false, message: 'Error al listar.' })
  return res.json(lista)
}

const findOne = async (req, res) => {
  const prestamo = await repository.findOne(req.params.id)
  if (!prestamo) return res.status(404).json({ success: false, message: 'No se encontró.' })

  if (req.usuario.rol !== 'encargado' && prestamo.usuarioId !== req.usuario.id) {
    return res.status(403).json({ success: false, message: 'No tienes permiso para ver este préstamo.' })
  }
  return res.json(prestamo)
}

// Estudiante o profesor solicita un equipo
const create = async (req, res) => {
  const { equipoId, fechaInicio, fechaDevolucion } = req.body

  if (!equipoId || !fechaInicio) {
    return res.status(400).json({ success: false, message: 'Faltan el equipo o la fecha de inicio.' })
  }

  const equipo = await equiposRepository.findOne(equipoId)
  if (!equipo) return res.status(404).json({ success: false, message: 'El equipo no existe.' })
  if (equipo.estado !== 'disponible') {
    return res.status(409).json({ success: false, message: 'El equipo no está disponible.' })
  }

  const prestamo = await repository.create({
    usuarioId: req.usuario.id, // sale del token, no del body
    equipoId,
    fechaInicio,
    fechaDevolucion,
  })

  if (!prestamo) return res.status(400).json({ success: false, message: 'No se pudo crear.' })
  return res.status(201).json(prestamo)
}

// El encargado aprueba, rechaza o marca como devuelto
const cambiarEstado = async (req, res) => {
  const { estado } = req.body
  const permitidos = ['activo', 'rechazado', 'devuelto']

  if (!permitidos.includes(estado)) {
    return res.status(400).json({ success: false, message: 'Estado inválido.' })
  }

  const prestamo = await repository.findOne(req.params.id)
  if (!prestamo) return res.status(404).json({ success: false, message: 'No se encontró.' })

  const desdePendiente = estado === 'activo' || estado === 'rechazado'
  if (desdePendiente && prestamo.estado !== 'pendiente') {
    return res.status(409).json({ success: false, message: 'Solo se puede decidir un préstamo pendiente.' })
  }
  if (estado === 'devuelto' && prestamo.estado !== 'activo') {
    return res.status(409).json({ success: false, message: 'Solo se puede devolver un préstamo activo.' })
  }

  if (estado === 'activo') {
    const equipo = await equiposRepository.findOne(prestamo.equipoId)
    if (!equipo || equipo.estado !== 'disponible') {
      return res.status(409).json({ success: false, message: 'El equipo ya no está disponible.' })
    }
    await equiposRepository.update({ estado: 'prestado' }, prestamo.equipoId)
  }

  const cambios = { estado }
  if (estado === 'devuelto') {
    cambios.fechaDevolucion = new Date()
    await equiposRepository.update({ estado: 'disponible' }, prestamo.equipoId)
  }

  const actualizado = await repository.update(cambios, req.params.id)
  if (!actualizado) return res.status(400).json({ success: false, message: 'No se pudo actualizar.' })
  return res.json(actualizado)
}

const remove = async (req, res) => {
  const resultado = await repository.remove(req.params.id)
  if (!resultado) return res.status(404).json({ success: false, message: 'No se encontró.' })
  return res.json(resultado)
}

export default { findAll, findOne, create, cambiarEstado, remove }