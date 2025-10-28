
import { body } from 'express-validator'

export const crearUsuariosValidaciones  = [
    body('nombre')
      .notEmpty()
      .withMessage('El nombre es obligatorio')
      .isString()
      .withMessage('El nombre debe ser texto'),

    body('apellido')
      .notEmpty()
      .withMessage('El apellido es obligatorio')
      .isString()
      .withMessage('El apellido debe ser texto'),

    body('nombreUsuario')
      .notEmpty()
      .withMessage('El nombreUsuario es obligatorio')
      .isEmail()
      .withMessage('Debe ser un email válido'),

    body('contrasenia')
      .notEmpty()
      .withMessage('La contraseña es obligatoria')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('celular')
      .optional()
      .isNumeric()
      .withMessage('El celular debe contener solo números')
      .isLength({ min: 10, max: 15 })
      .withMessage('El celular debe tener entre 10 y 15 dígitos'),
    body('foto')
      .optional()
      .isURL()
      .withMessage('La foto debe ser una URL válida')
  ]

export const actualizarUsuarioValidaciones = [
    body('nombre')
      .optional()
      .isString()
      .withMessage('El nombre debe ser texto')
      .notEmpty()
      .withMessage('El nombre no puede estar vacío'),

    body('apellido')
      .optional()
      .isString()
      .withMessage('El apellido debe ser texto')
      .notEmpty()
      .withMessage('El apellido no puede estar vacío'),

    body('nombreUsuario')
      .optional()
      .isEmail()
      .withMessage('Debe ser un email válido'),

    body('contrasenia')
      .optional()
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('celular')
      .optional()
      .isNumeric()
      .withMessage('El celular debe contener solo números')
      .isLength({ min: 10, max: 15 })
      .withMessage('El celular debe tener entre 10 y 15 dígitos'),

    body('foto')
      .optional()
      .isURL()
      .withMessage('La foto debe ser una URL válida')
  ]