import ShiftsService from '../services/turno.services.js'; 

export default class ShiftsControlador {
    
    constructor() {
        this.turnos = new ShiftsService(); 
    }

    // @desc    Obtener todos los turnos con filtros, paginación y ordenación
    // @route   GET /api/v1/shifts
    buscarTodos = async (req, res) => {
        const turnoId = req.query.turnoId;
        const turnoOrden = req.query.orden;
        const limit = req.query.limit;
        const offset = req.query.offset;
        const order = req.query.order;
        const asc = req.query.asc;

        try {
            const pLimit = limit ? Number(limit) : 0;
            const pOffset = offset ? Number(offset) : 0;
            const pOrder = order || 'horaDesde'; 
            const pAsc = asc === 'false' ? false : true;

            const filters = {};

            if (turnoId) filters.turnoId = turnoId;
            if (turnoOrden) filters.orden = turnoOrden;
            

            const dataTurnos = await this.turnos.buscarTodos(
                filters,
                pLimit,
                pOffset,
                pOrder,
                pAsc
            );

            res.json({ status: 'OK', data: dataTurnos });
        } catch (error) {
            res
                .status(error?.status || 500)
                .json({ status: 'FAILED', data: { error: error?.message || error } });
        }
    }

    buscarPorId = async (req, res) => {
        const turnoId = Number(req.params.turnoId);

        if (!Number.isInteger(turnoId) || turnoId <= 0) {
            return res.status(400).json({ status: 'FAILED', data: { error: 'El parámetro turnoId debe ser un número entero positivo.' } });
        }

        try {
            const turno = await this.turnos.buscarPorId(turnoId);

            res.json({ status: 'OK', data: turno });
        } catch (error) {
            res
                .status(error?.status || 500)
                .json({ status: 'FAILED', data: { error: error?.message || error } });
        }
    }

    // @desc    Crear un nuevo turno
    // @route   POST /api/v1/shifts
    crear = async (req, res) => {
        const { body } = req;
        const { servicioId, clienteId, horaInicio, duracionMinutos, estado, notas } = body;
        
        if (!servicioId || !clienteId || !horaInicio) {
            return res.status(400).json({
                status: 'FAILED',
                data: {
                    error: "Uno de los siguientes datos falta o es vacío: 'servicioId', 'clienteId', 'horaInicio'."
                }
            });
        }

        const nuevoTurno = {
            servicioId: Number(servicioId),
            clienteId: Number(clienteId),
            horaInicio: new Date(horaInicio), 
            duracionMinutos: duracionMinutos ? Number(duracionMinutos) : 60,
            estado: estado || 'pendiente',
            notas: notas ? notas.trim() : null
        }

        try {
            const turnoCreado = await this.turnos.crear(nuevoTurno);
            res.status(201).json({ status: 'OK', data: turnoCreado });
        } catch (error) {
            res
                .status(error?.status || 500)
                .json({ status: 'FAILED', data: { error: error?.message || error } });
        }
    }

    // @desc    Actualizar un turno
    // @route   PUT /api/v1/shifts/:turnoId
    actualizar = async (req, res) => {
        const body = req.body;
        const turnoId = req.params.turnoId;

        if (!turnoId) {
            return res.status(404).json({
                status: 'FAILED',
                data: {
                    error: 'El parámetro turnoId no puede ser vacío.'
                }
            });
        }

        try {
            const turnoActualizado = await this.turnos.actualizar(turnoId, body);
            res.status(200).json({ status: 'OK', data: turnoActualizado });
        } catch (error) {
            res
                .status(error?.status || 500)
                .json({ status: 'FAILED', data: { error: error?.message || error } });
        }
    }

    // @desc    Eliminar un turno
    // @route   DELETE /api/v1/shifts/:turnoId
    eliminar = async (req, res) => {
        const turnoId = req.params.turnoId;

        if (!turnoId) {
            return res.status(404).json({
                status: 'FAILED',
                data: { error: 'El parámetro turnoId no puede ser vacío.' }
            });
        }

        try {
            await this.turnos.eliminar(turnoId);
            res.status(200).json({
                status: 'OK',
                data: {
                    message: 'Turno eliminado correctamente'
                }
            });
        } catch (error) {
            res
                .status(error?.status || 500)
                .send({ status: 'FAILED', data: { error: error?.message || error } });
        }
    }
}
