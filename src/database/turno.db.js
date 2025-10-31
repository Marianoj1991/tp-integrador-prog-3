import ShiftsDTO from './turnoDTO.js'; 
import { allowedDirections } from '../constants/index.js'; 
import DBConnection from './dbConnection.db.js'; 

const FIELDS = 't.turno_id, t.orden, t.hora_desde, t.hora_hasta, t.activo, t.creado, t.modificado';
const TABLE = 'turnos as t'; 

export default class ShiftsDB {

    _buildQuery = (baseSql, filters, orderBy, asc) => {
        let strSql = baseSql;
        const filterValuesArray = [];

        if (filters && filters.length > 0) {
            strSql += ' WHERE ';
            const filterClauses = [];
            for (const filter of filters) {
                for (const clave of Object.keys(filter)) {
                    filterClauses.push(`t.${clave} = ?`);
                    filterValuesArray.push(filter[clave]);
                }
            }
            strSql += filterClauses.join(' AND ');
        }

        if (orderBy) {
            const dbOrderBy = ShiftsDTO.getFieldName(orderBy);
            strSql += ` ORDER BY t.${dbOrderBy} ${asc.trim()}`;
        }

        return { strSql, filterValuesArray };
    }


    /**
     * @param {object} filters - Filtros en formato JS (camelCase).
     */
    buscarTodos = async (
        filters = null,
        limit = 0,
        offset = 0,
        orderBy = 'turno_id', 
        asc = true
    ) => {
        const strAsc = asc ? 'ASC' : 'DESC';

        // 1. Validación de dirección de orden
        // Nota: Asegúrate que 'allowedDirections' se exporte correctamente de '../constants/index.js'
        // if (!allowedDirections.includes(strAsc.trim().toUpperCase())) {
        //     throw new Error('Dirección de orden inválida');
        // }

        // 2. Base de la consulta
        let baseSql = `SELECT ${FIELDS} FROM ${TABLE}`; 

        // 3. Convertir filtros de JS a SQL
        const dbFilters = ShiftsDTO.toDBFilters(filters);
        
        // 4. Construir consulta con filtros y orden
        // El método _buildQuery ahora agrega el WHERE si es necesario
        let { strSql, filterValuesArray } = this._buildQuery(baseSql, dbFilters, orderBy, strAsc);

        // 5. Agregar Paginación
        if (limit) {
            strSql += ' LIMIT ? OFFSET ? ';
            // MySQL requiere que limit y offset se pasen como valores de la consulta
            filterValuesArray.push(limit, offset); 
        }

        try {
            const conexion = await DBConnection.initConnection();
            const [rows] = await conexion.query(strSql, filterValuesArray);

            return rows;
                
        } catch (error) {
            console.log('[DB] Error en buscarTodos [Shifts]');
            console.error('DB error:', error.code, error.sqlMessage);
            throw error;
        }
    }

    buscarPorId = async (turnoId) => {
        const strSql = `SELECT ${FIELDS} FROM ${TABLE} WHERE t.turno_id = ?`;

        const conexion = await DBConnection.initConnection();

        try {
            const [rows] = await conexion.query(strSql, [turnoId]);

            if (rows.length === 0) return null;
            
            const row = rows[0];
            return new ShiftsDTO(
                row.turno_id,
                row.orden,
                row.hora_desde,
                row.hora_hasta,
                row.activo,
                row.creado,
                row.modificado
            );

        } catch (error) {
            console.log('[DB] Error en buscarPorId [Shifts]');
            throw error;
        }
    }

    crear = async ({
        servicioId,
        clienteId,
        horaInicio,
        duracionMinutos = 60,
        estado = 'pendiente',
        notas = null
    }) => {
        const strSql = `
            INSERT INTO turnos 
                (servicio_id, cliente_id, hora_inicio, duracion_minutos, estado, notas) 
            VALUES 
                (?, ?, ?, ?, ?, ?);
        `;

        const conexion = await DBConnection.initConnection();
        
        try {
            const [result] = await conexion.query(strSql, [
                servicioId,
                clienteId,
                horaInicio,
                duracionMinutos,
                estado,
                notas
            ]);

            const [rows] = await conexion.query('SELECT LAST_INSERT_ID() AS turnoId');
            return this.buscarPorId(rows[0].turnoId);

        } catch (error) {
            console.log('[DB] Error en crear [Shifts]');
            throw error;
        }
    }

    actualizar = async (turnoId, campos) => {
        const conexion = await DBConnection.initConnection();

        try {
            const entradas = Object.entries(campos)
                .filter(([key, valor]) => valor !== undefined)
                .map(([key, valor]) => [ShiftsDTO.getFieldName(key), valor]); 

            if (entradas.length === 0) {
                return null; 
            }

            const setClause = entradas.map(([campo]) => `${campo} = ?`).join(', ');
            const valores = entradas.map(([_, valor]) => valor);
            
            const strSql = `UPDATE turnos SET ${setClause}, modificado = NOW() WHERE turno_id = ?`;

            const [result] = await conexion.query(strSql, [...valores, turnoId]);
            
            if (result.affectedRows === 0) return null;

            return this.buscarPorId(turnoId);

        } catch (error) {
            console.log('[DB] Error en actualizar [Shifts]');
            throw new Error(error.message);
        }
    }

    eliminar = async (turnoId) => {
        const strSql = 'DELETE FROM turnos WHERE turno_id = ?'; 

        const conexion = await DBConnection.initConnection();

        try {
            const [result] = await conexion.query(strSql, [turnoId]);
            return result.affectedRows; 
        } catch (error) {
            console.log('[DB] Error en eliminar [Shifts]');
            throw error;
        }
    }
}
