import createHttpError from 'http-errors';

import ShiftsDB from '../database/turno.db.js'; 
import ShiftsDTO from '../database/turnoDTO.js'; 

export default class ShiftsService { 
    
    constructor() {
        this.shiftDB = new ShiftsDB(); 
    }

    buscarTodos = async (filters, limit, offset, order, asc) => {
        let sqlFilter = null
        if (Object.keys(filters).length > 0) {
            sqlFilter = ShiftsDTO.toDBFilters(filters); 
        }

        const sqlOrder = ShiftsDTO.getFieldName(order);
        const strAsc = asc ? 'ASC ' : 'DESC ';

        try {
            return this.shiftDB.buscarTodos(sqlFilter, limit, offset, sqlOrder, strAsc);
        } catch (err) {
            throw err
        }
    };

    buscarPorId = async (id) => {
        const turno = await this.shiftDB.buscarPorId(id);
        if (!turno) {
            throw createHttpError(404, 'Turno no encontrado.'); 
        }
        return turno;
    };

    crear = async (turnoData) => {
        if (new Date(turnoData.horaInicio) < new Date()) {
            throw createHttpError(400, 'No se puede reservar un turno en el pasado.');
        }
        
        const existeTurnoSolapado = null; 

        if (existeTurnoSolapado) {
             throw createHttpError(409, 'Ya existe un turno solapado para ese momento.');
        }

        const nuevoTurno = await this.shiftDB.crear(turnoData); 
        return nuevoTurno;
    };

    actualizar = async (id, campos) => {
        const turnoExistente = await this.shiftDB.buscarPorId(id);
        if (!turnoExistente) {
            throw createHttpError(404, 'Turno no encontrado para actualizar.');
        }
        
        const updatedTurno = await this.shiftDB.actualizar(id, campos);

        if (!updatedTurno) {
            return turnoExistente;
        }

        return updatedTurno;
    };

    eliminar = async (id) => {
        const deletedRows = await this.shiftDB.eliminar(id);
        if (deletedRows === 0) {
            throw createHttpError(404, 'Turno no encontrado para eliminar.');
        }
        return { message: 'Turno eliminado exitosamente' };
    };
}
