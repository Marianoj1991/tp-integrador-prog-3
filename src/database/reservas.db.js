import DBConnection from './dbConnection.db.js'

export default class ReservasDB {
  buscarTodos = async () => {
    const sql = 'SELECT * FROM reservas WHERE activo = 1'

    try {
      const conexion = await DBConnection.initConnection()
      const [rows] = await conexion.query(sql)
      return rows
    } catch (error) {
      console.log('[DBReservas] Error en buscarTodos')
      throw error
    }
  }

  buscarPorId = async (reservaId) => {
    const sql = 'SELECT * FROM reservas WHERE activo = 1 AND reserva_id=?'

    try {
      const conexion = await DBConnection.initConnection()
      const [rows] = await conexion.query(sql, [reservaId])
      if (rows.length === 0) {
        return null
      }
      return rows[0]
    } catch (error) {
      console.log('[DBreservas] Error en buscarPorId')
      throw error
    }
  }

  crear = async (reserva) => {
    const {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total
    } = reserva

    const sql = `INSERT INTO reservas 
            (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) 
            VALUES (?,?,?,?,?,?,?,?)`

    try {
      const conexion = await DBConnection.initConnection()
      const [result] = await conexion.query(sql, [
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total
      ])

      if (result.affectedRows === 0) {
        return null
      }
      return this.buscarPorId(result.insertId)
    } catch (error) {
      console.log('[DBReservas] Error en crear')
      throw error
    }
  }

  datosParaNotificacion = async (reserva_id, usuario_id) => {
    const conexion = await DBConnection.initConnection()

    try {
      const sql = `CALL obtenerDatosNotificacion(?, ?);`

      const [reserva] = await conexion.query(sql, [reserva_id, usuario_id])
      if (reserva.length === 0) {
        return null
      }

      return reserva
    } catch (error) {
      console.log('[DBreservas] Error en datos para notificacion', error)
      throw error
    }
  }

  obtenerMailAdmins = async () => {
    const conexion = await DBConnection.initConnection()

    try {
      const sql = `CALL obtenerMailAdmins();`

      const [rows] = await conexion.query(sql)
      if (rows.length === 0) {
        return null
      }

      return rows
    } catch (error) {
      console.log('[DBreservas] Error en datos para notificacion', error)
      throw error
    }
  }

  actualizar = async (reservaId, campos) => {
    const conexion = await DBConnection.initConnection()

    try {
      const entradas = Object.entries(campos).filter(
        ([_, valor]) => valor !== undefined
      )

      if (entradas.length === 0) {
        throw new Error('No hay campos para actualizar')
      }

      const setClause = entradas.map(([campo]) => `${campo} = ?`).join(', ')
      const valores = entradas.map(([_, valor]) => valor)

      const strSql = `UPDATE reservas SET ${setClause} WHERE reserva_id = ?`

      await conexion.query(strSql, [...valores, reservaId])

      return this.buscarPorId(reservaId)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  eliminar = async (reservaId) => {
    const strSql = 'UPDATE reservas SET activo = 0 WHERE reserva_id = ?'

    const conexion = await DBConnection.initConnection()

    try {
      await conexion.query(strSql, [reservaId])
    } catch (error) {
      throw error
    }
  }

buscarDatosParaInformes = async () => {
   const conexion = await DBConnection.initConnection()
  const sql1 = `CALL obtenerDatosInforme()`;
  const sql2 = `CALL totalReservasPorSalon()`;
  const sql3 = `CALL ingresosPorMes()`;

  const [datosInforme] = await conexion.query(sql1);
  const [totalPorSalon] = await conexion.query(sql2);
  const [ingresosPorMes] = await conexion.query(sql3);

  return {
    datosInforme: datosInforme[0],   
    totalPorSalon: totalPorSalon[0], 
    ingresosPorMes: ingresosPorMes[0] 
  };
};

}
