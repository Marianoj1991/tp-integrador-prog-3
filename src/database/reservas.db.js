import { DBConnection } from "./dbConnection.db.js";

export default class ReservasDB {

    buscarTodos = async() => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1';
        const [reservas] = await DBConnection.execute(sql);
        return reservas;
    }

    buscarPorId = async(reservaId) => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1 AND reservaId = ?';
        const [reserva] = await DBConnection.execute(sql, [reservaId]);
        if(reserva.length === 0){
            return null;
        }

        return reserva[0];
    }

    crear = async(reserva) => {
        const {
                fecha_reserva,
                salon_id,
                usuario_id,
                turno_id,
                foto_cumpleaniero, 
                tematica,
                importe_salon,
                importe_total 
            } = reserva;
        
        const sql = `INSERT INTO reservas 
            (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) 
            VALUES (?,?,?,?,?,?,?,?)`;
        
        const [result] = await DBConnection.execute(sql, 
            [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total]);

        if (result.affectedRows === 0){
            return null;
        }

        return this.buscarPorId(result.insertId);
    }

    
    datosParaNotificacion = async(reservaId) => {
        const sql = `SELECT r.fecha_reserva as fecha, s.titulo as salon, t.orden as turno
            FROM reservas as r
            INNER JOIN  salones as s on s.salon_id = r.salon_id 
            INNER JOIN  turnos as t on t.turno_id = r.turno_id
            WHERE r.activo = 1 and r.reservaId = ?`;

        const [reserva] = await DBConnection.execute(sql, [reservaId]);
        if(reserva.length === 0){
            return null;
        }

        return reserva[0];
    }
}