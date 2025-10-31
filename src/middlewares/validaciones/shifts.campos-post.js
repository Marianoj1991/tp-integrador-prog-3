import { body } from 'express-validator';

export const crearShiftsValidaciones = [
    body('horaInicio')
        .notEmpty()
        .withMessage('La hora de inicio es obligatoria')
        .isISO8601()
        .toDate()
        .withMessage('El formato de fecha/hora es inválido (debe ser ISO 8601).'),

    body('duracionMinutos')
        .notEmpty()
        .withMessage('La duración en minutos es obligatoria')
        .isInt({ min: 10, max: 120 })
        .withMessage('La duración debe ser un número entero entre 10 y 120.'),

    body('servicioId')
        .notEmpty()
        .withMessage('El ID del servicio es obligatorio')
        .isInt({ gt: 0 })
        .withMessage('El ID del servicio debe ser un número entero válido.'),

    body('clienteId')
        .notEmpty()
        .withMessage('El ID del cliente es obligatorio')
        .isInt({ gt: 0 })
        .withMessage('El ID del cliente debe ser un número entero válido.'),

    body('estado')
        .optional()
        .isString()
        .isIn(['RESERVADO', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO'])
        .withMessage('El estado del turno es inválido.'),

    body('notas')
        .optional()
        .isString()
        .withMessage('Las notas deben ser texto.'),
];

export const actualizarShiftsValidaciones = [
    body('horaInicio')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('El formato de fecha/hora es inválido (debe ser ISO 8601).'),

    body('duracionMinutos')
        .optional()
        .isInt({ min: 10, max: 120 })
        .withMessage('La duración debe ser un número entero entre 10 y 120.'),

    body('servicioId')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('El ID del servicio debe ser un número entero válido.'),

    body('clienteId')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('El ID del cliente debe ser un número entero válido.'),

    body('estado')
        .optional()
        .isString()
        .isIn(['RESERVADO', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO'])
        .withMessage('El estado del turno es inválido.'),

    body('notas')
        .optional()
        .isString()
        .withMessage('Las notas deben ser texto.'),
];
