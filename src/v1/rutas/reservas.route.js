import express from 'express';
import { check } from 'express-validator';
import ReservasControlador from '../../controllers/reservas.controlador.js';
import { validarCampos } from '../../middlewares/validaciones/validar-campos.js'


const reservasControlador = new ReservasControlador();
const router = express.Router();

router.get('/:reservaId', reservasControlador.buscarPorId);
router.get('/', reservasControlador.buscarTodos);
router.post('/', 
    [
        check('fecha_reserva', 'La fecha es necesaria.').notEmpty(),
        check('salon_id', 'El salón es necesario.').notEmpty(),
        check('usuario_id', 'El usuario es necesario.').notEmpty(), 
        check('turno_id', 'El turno es necesario.').notEmpty(),  
        check('servicios', 'Faltan los servicios de la reserva.')
        .notEmpty()
        .isArray(),   
        check('servicios.*.importe')
        .isFloat() 
        .withMessage('El importe debe ser numérico.'),   
        validarCampos
    ],
    reservasControlador.crear);

export default router;