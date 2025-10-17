import { body } from 'express-validator'

export const crearServiciosValidaciones  = [
    body('descripcion')
      .notEmpty()
      .withMessage('La descripción es obligatoria')
      .isString()
      .withMessage('La descripción debe ser texto'),

    body('importe')
      .notEmpty()
      .withMessage('El importe es obligatorio')
      .isNumeric()
      .withMessage('El importe debe ser un número'),

    body('activo')
      .notEmpty()
      .withMessage('El estado activo es obligatorio')
      .isNumeric()
      .withMessage('El estado activo debe ser un número')

  ]

export const actualizarServiciosValidaciones = [
    body('descripcion')
      .optional()
      .isString()
      .withMessage('La descripción debe ser texto')
      .notEmpty()
      .withMessage('La descripción no puede estar vacía'),

    body('importe')
      .optional()
      .isNumeric()
      .isDecimal()
      .withMessage('El importe debe ser un número'),

    body('activo')
      .optional()
      .notEmpty()
      .withMessage('El estado activo es obligatorio')
      .isNumeric()
      .withMessage('El estado activo debe ser un número')

  ]
