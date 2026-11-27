import express from 'express'
import controller from '../controllers/auth.controller.js'
import { verificarToken } from '../middlewares/auth.js'

const router = express.Router()

router.post('/registro', controller.registro)
router.post('/login', controller.login)
router.get('/perfil', verificarToken, controller.perfil)
router.put('/perfil', verificarToken, controller.editarPerfil)
router.put('/password', verificarToken, controller.cambiarPassword)

export default router