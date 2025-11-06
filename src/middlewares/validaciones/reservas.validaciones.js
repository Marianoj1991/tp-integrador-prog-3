import { body } from 'express-validator'

export const crearReservasValidaciones = [
  body('fecha_reserva', 'La fecha es necesaria.').notEmpty(),
  body('salon_id', 'El salón es necesario.').notEmpty(),
  body('usuario_id', 'El usuario es necesario.').notEmpty(),
  body('turno_id', 'El turno es necesario.').notEmpty(),
  body('servicios', 'Faltan los servicios de la reserva.').notEmpty().isArray(),
  body('servicios.*.importe')
    .isFloat()
    .withMessage('El importe debe ser numérico.'),
  body('comentario')
    .optional()
    .isString()
    .withMessage('El comentario debe ser texto'),
  body('foto_cumpleaniero')
    .optional()
    .isString()
    .withMessage('La foto debe ser texto'),
  body('tematica')
    .optional()
    .isString()
    .withMessage('La temática debe ser texto'),
  body('importe_salon')
    .optional()
    .isNumeric()
    .withMessage('El importe del salón debe ser número'),
  body('importe_total')
    .optional()
    .isNumeric()
    .withMessage('El importe tota debe ser número')
]

export const actualizarReservaValidacion = [
  body('comentario')
    .optional()
    .isString()
    .withMessage('El comentario debe ser texto')
]
