import { allowedDirections } from '../constants/index.js'
import DBConnection from './dbConnection.db.js'

export default class ServiciosDB {
  buscarTodos = async (
    filters = null,
    limit = 0,
    offset = 0,
    orderBy = 'servicio_id',
    asc = 'ASC'
  ) => {
    let strSql = `SELECT servicio_id, descripcion, importe, activo, creado, modificado FROM servicios WHERE activo = 1 `

    const filterValuesArray = []

    try {

      if (!allowedDirections.includes(asc.trim().toUpperCase())) {
        throw new Error('Dirección de orden inválida')
      }

      if (filters) {
        strSql += 'AND '
        for (const filter of filters) {
          for (const clave of Object.keys(filter)) {
            strSql += `${clave} = ? AND `
            filterValuesArray.push(filter[clave])
          }
        }

        strSql = strSql.substring(0, strSql.length - 4)
      }

      if (orderBy) {
        strSql += `ORDER BY ${orderBy} ${asc.trim()}`
      }

      if (limit) {
        strSql += ' LIMIT ? OFFSET ? '
        filterValuesArray.push(limit, offset)
      }

      const conexion = await DBConnection.initConnection()
      console.log('SQL Query:', strSql)
      const [rows] = await conexion.query(strSql, filterValuesArray)

      return rows
    } catch (error) {
      console.log('[DB] Error en buscarTodos')
      console.error('DB error:', error.code, error.sqlMessage)
      throw error
    }

  }

  buscarPorDescripcion = async (descripcion) => {
    const strSql = `SELECT servicio_id, descripcion, importe, activo, creado, modificado FROM servicios WHERE descripcion = ?`

    const conexion = await DBConnection.initConnection()
    try {
      const [rows] = await conexion.query(strSql, [descripcion])
      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      console.log('[DB] Error en buscarPorDescripcion')
      throw error
    }
  }

  buscarPorId = async (servicioId) => {
    const strSql = `SELECT servicio_id, descripcion, importe, activo, creado, modificado FROM servicios WHERE servicio_id = ?`

    const conexion = await DBConnection.initConnection()

    try {
      const [rows] = await conexion.query(strSql, [servicioId])

      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      console.log('[DB] Error en buscarPorId')
      throw error
    }
  }

  crear = async ({
    descripcion,
    importe,
    activo = 1
  }) => {
    const strSql =
      'INSERT INTO servicios (descripcion, importe, activo) VALUES (?, ?, ?);'

    const conexion = await DBConnection.initConnection()
    console.log(descripcion, importe, activo)
    try {
      await conexion.query(strSql, [
        descripcion,
        importe,
        activo
      ])
      
      const [rows] = await conexion.query(
        'SELECT LAST_INSERT_ID() AS servicioId'
      )
      return this.buscarPorId(rows[0].servicioId)
    } catch (error) {
      throw error
    }
  }

  actualizar = async (servicioId, campos) => {
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

      const strSql = `UPDATE servicios SET ${setClause} WHERE servicio_id = ?`

      await conexion.query(strSql, [...valores, servicioId])

      return this.buscarPorId(servicioId)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  eliminar = async (servicioId) => {
    const strSql = 'UPDATE servicios SET activo = 0 WHERE servicio_id = ?'

    const conexion = await DBConnection.initConnection()

    try {
      await conexion.query(strSql, [servicioId])
    } catch (error) {
      throw error
    }
  }
}
