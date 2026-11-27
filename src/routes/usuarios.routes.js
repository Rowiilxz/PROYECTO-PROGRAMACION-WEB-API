import express from 'express'
import controller from '../controllers/usuarios.controller.js'
import { permitirRoles } from '../middlewares/auth.js'

const router = express.Router()

// Todo lo de usuarios es solo para el encargado
router.get('/', permitirRoles('encargado'), controller.findAll)
router.put('/:id/aprobar', permitirRoles('encargado'), controller.aprobar)
router.delete('/:id', permitirRoles('encargado'), controller.remove)

export default router