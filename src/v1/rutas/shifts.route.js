import { Router } from 'express';
import passport from 'passport';

import ShiftsControlador from '../../controllers/shifts.controlador.js';
import { validarCampos } from '../../middlewares/validaciones/validar-campos.js';

import { 
    actualizarShiftsValidaciones, 
    crearShiftsValidaciones 
} from '../../middlewares/validaciones/shifts.campos-post.js'; 
import { rolesPermitidos } from '../../middlewares/auth/roles-permitidos.js';

const shiftsControlador = new ShiftsControlador();

const router = Router();

router.get('/', shiftsControlador.buscarTodos);

router.get('/:turnoId', shiftsControlador.buscarPorId);

const handleAuthError = (err, req, res, next) => {
    if (err) {
        return res
            .status(500)
            .json({ message: 'Error interno al validar el token' });
    }

    if (!req.user) {
        
        return res
            .status(401)
            .json({ message: req.authInfo?.message || 'Token no autorizado' });
    }

    next();
};


router.post(
    '/',
    
    passport.authenticate('jwt', { session: false, failWithError: true }),
    handleAuthError,
    rolesPermitidos('admin', 'employee'), 
    crearShiftsValidaciones, 
    validarCampos,
    shiftsControlador.crear
);

router.put(
    '/:turnoId',
    passport.authenticate('jwt', { session: false, failWithError: true }),
    handleAuthError, 
    rolesPermitidos('admin', 'employee'),
    actualizarShiftsValidaciones,
    validarCampos,
    shiftsControlador.actualizar
);

router.delete(
    '/:turnoId', 
    passport.authenticate('jwt', { session: false, failWithError: true }),
    handleAuthError,
    rolesPermitidos('admin'), 
    shiftsControlador.eliminar
);

export default router;