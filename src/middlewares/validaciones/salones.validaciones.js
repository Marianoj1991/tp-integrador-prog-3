import { body } from 'express-validator'

export const crearSalonesValidaciones = [
  body('titulo')
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isString()
    .withMessage('El título debe ser texto'),

  body('direccion')
    .notEmpty()
    .withMessage('La dirección es obligatoria')
    .isString()
    .withMessage('La dirección debe ser texto'),

  body('importe')
    .notEmpty()
    .withMessage('El importe es obligatorio')
    .isNumeric()
    .withMessage('El importe debe ser un número'),

  body('latitud')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('La latitud debe ser un número válido entre -90 y 90'),

  body('longitud')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('La longitud debe ser un número válido entre -180 y 180'),

  body('capacidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La capacidad debe ser un número entero positivo'),
  body('activo')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Activo puede ser 0 o 1')
]

export const actualizarSalonesValidaciones = [
  body('titulo')
    .optional()
    .isString()
    .withMessage('El título debe ser texto')
    .notEmpty()
    .withMessage('El título no puede estar vacío'),

  body('direccion')
    .optional()
    .isString()
    .withMessage('La dirección debe ser texto')
    .notEmpty()
    .withMessage('La dirección no puede estar vacía'),

  body('importe')
    .optional()
    .isNumeric()
    .withMessage('El importe debe ser un número'),

  body('latitud')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('La latitud debe ser un número válido entre -90 y 90'),

  body('longitud')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('La longitud debe ser un número válido entre -180 y 180'),

  body('capacidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La capacidad debe ser un número entero positivo'),
  body('activo')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Activo puede ser 0 o 1')
]
