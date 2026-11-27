import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import repository from '../repositories/usuarios.repository.js'

const ROLES = ['estudiante', 'profesor', 'encargado']

const limpiar = (u) => ({
  id: u.id,
  nombre: u.nombre,
  correo: u.correo,
  rol: u.rol,
  estado: u.estado,
})

const registro = async (req, res) => {
  const { nombre, correo, password, rol } = req.body

  if (!nombre || !correo || !password || !ROLES.includes(rol)) {
    return res.status(400).json({ success: false, message: 'Datos incompletos o rol inválido.' })
  }
  if (await repository.findByCorreo(correo)) {
    return res.status(409).json({ success: false, message: 'Ese correo ya está registrado.' })
  }

  const hash = await bcrypt.hash(password, 10)
  const estado = rol === 'encargado' ? 'pendiente' : 'activo'
  const usuario = await repository.create({ nombre, correo, password: hash, rol, estado })

  if (!usuario) {
    return res.status(400).json({ success: false, message: 'No se pudo registrar.' })
  }
  return res.status(201).json(limpiar(usuario))
}

const login = async (req, res) => {
  const { correo, password } = req.body
  const usuario = await repository.findByCorreo(correo)

  if (!usuario || !(await bcrypt.compare(password || '', usuario.password))) {
    return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' })
  }
  if (usuario.estado === 'pendiente') {
    return res.status(403).json({ success: false, message: 'Tu cuenta está pendiente de aprobación.' })
  }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )
  return res.json({ token, usuario: limpiar(usuario) })
}

const perfil = async (req, res) => {
  const usuario = await repository.findOne(req.usuario.id)
  if (!usuario) return res.status(404).json({ success: false, message: 'No se encontró.' })
  return res.json(limpiar(usuario))
}

const editarPerfil = async (req, res) => {
  const { nombre, correo } = req.body
  const cambios = {}
  if (nombre) cambios.nombre = nombre
  if (correo) cambios.correo = correo

  const usuario = await repository.update(cambios, req.usuario.id)
  if (!usuario) return res.status(400).json({ success: false, message: 'No se pudo actualizar.' })
  return res.json(limpiar(usuario))
}

const cambiarPassword = async (req, res) => {
  const { actual, nueva } = req.body
  const usuario = await repository.findOne(req.usuario.id)

  if (!usuario || !nueva || !(await bcrypt.compare(actual || '', usuario.password))) {
    return res.status(400).json({ success: false, message: 'La contraseña actual no es correcta.' })
  }

  await repository.update({ password: await bcrypt.hash(nueva, 10) }, req.usuario.id)
  return res.json({ success: true, message: 'Contraseña actualizada.' })
}

export default { registro, login, perfil, editarPerfil, cambiarPassword }