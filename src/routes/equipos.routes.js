import express from 'express'
import controller from '../controllers/equipos.controller.js'
import { permitirRoles } from '../middlewares/auth.js'

const router = express.Router()

// Cualquier usuario con sesión puede ver los equipos
router.get('/', controller.findAll)
router.get('/:id', controller.findOne)

// Solo el encargado los administra
router.post('/', permitirRoles('encargado'), controller.create)
router.put('/:id', permitirRoles('encargado'), controller.update)
router.delete('/:id', permitirRoles('encargado'), controller.remove)

export default router