import { validationResult } from 'express-validator'

export function validarCampos(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() })
  }
  next()
}
