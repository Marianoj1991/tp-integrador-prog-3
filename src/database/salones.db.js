import { allowedDirections } from '../constants/index.js'
import DBConnection from './dbConnection.db.js'

export default class SalonesDB {
  buscarTodos = async (
    filters = null,
    limit = 0,
    offset = 0,
    orderBy = 'salon_id',
    asc = 'ASC'
  ) => {
    let strSql = `SELECT salon_id, direccion, titulo, importe, capacidad, activo, creado, modificado FROM salones WHERE activo = 1 `

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
      const [rows] = await conexion.query(strSql, filterValuesArray)

      return rows
    } catch (error) {
      console.error('[Salones DB][buscarTodos] Error: ', error)
      throw error
    }
  }

  buscarImporteSalon = async (id) => {
    const strSql = `SELECT importe FROM salones WHERE salon_id = ?`

    const conexion = await DBConnection.initConnection()
    try {
      const [rows] = await conexion.query(strSql, [id])
      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      console.error('[Salones DB][buscarImporteSalon] Error: ', error)
      throw error
    }
  }

  buscarPorTitulo = async (titulo) => {
    const strSql = `SELECT salon_id, direccion, titulo, importe, capacidad, activo, creado, modificado FROM salones WHERE titulo = ?`

    const conexion = await DBConnection.initConnection()
    try {
      const [rows] = await conexion.query(strSql, [titulo])
      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      console.error('[Salones DB][buscarPorTitulo] Error: ', error)
      throw error
    }
  }

  buscarPorId = async (salonId) => {
    const strSql = `SELECT salon_id, direccion, titulo, importe, capacidad, activo, creado, modificado FROM salones WHERE salon_id = ?`

    const conexion = await DBConnection.initConnection()

    try {
      const [rows] = await conexion.query(strSql, [salonId])

      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      console.error('[Salones DB][buscarPorId] Error: ', error)
      throw error
    }
  }

  crear = async ({
    bDireccion,
    bImporte,
    bActivo,
    bTitulo,
    bCapacidad,
    bLatitud,
    bLongitud
  }) => {
    const strSql =
      'INSERT INTO salones (direccion, importe, activo, titulo, capacidad, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?, ?);'

    const conexion = await DBConnection.initConnection()
    try {
      await conexion.query(strSql, [
        bDireccion,
        bImporte,
        bActivo,
        bTitulo,
        bCapacidad,
        bLatitud,
        bLongitud
      ])

      const [rows] = await conexion.query('SELECT LAST_INSERT_ID() AS salonId')
      return this.buscarPorId(rows[0].salonId)
    } catch (error) {
      console.error('[Salones DB][crear] Error: ', error)
      throw error
    }
  }

  actualizar = async (salonId, campos) => {
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

      const strSql = `UPDATE salones SET ${setClause} WHERE salon_id = ?`

      await conexion.query(strSql, [...valores, salonId])

      return this.buscarPorId(salonId)
    } catch (error) {
      console.error('[Salones DB][actualizar] Error: ', error)
      throw new Error(error.message)
    }
  }

  eliminar = async (salonId) => {
    const strSql = 'UPDATE salones SET activo = 0 WHERE salon_id = ?'

    const conexion = await DBConnection.initConnection()

    try {
      await conexion.query(strSql, [salonId])
    } catch (error) {
      console.error('[Salones DB][eliminar] Error: ', error)
      throw error
    }
  }
}
