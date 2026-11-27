import express from 'express'
import controller from '../controllers/prestamos.controller.js'
import { permitirRoles } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', controller.findAll)
router.get('/:id', controller.findOne)

// Estudiantes y profesores solicitan
router.post('/', permitirRoles('estudiante', 'profesor'), controller.create)

// El encargado aprueba, rechaza, marca devolución o elimina
router.put('/:id/estado', permitirRoles('encargado'), controller.cambiarEstado)
router.delete('/:id', permitirRoles('encargado'), controller.remove)

export default router