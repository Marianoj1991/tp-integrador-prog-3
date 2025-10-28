import { allowedColumns, allowedDirections } from '../constants/index.js'
import DBConnection from './dbConnection.db.js'

export default class UsuariosDB {
  buscarTodos = async (
    filters = null,
    limit = 0,
    offset = 0,
    orderBy = 'usuario_id',
    asc = 'ASC'
  ) => {
    let strSql = `SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto, activo, creado, modificado FROM usuarios WHERE activo = 1 `

    const filterValuesArray = []

    try {
      if (!allowedColumns.includes(orderBy.trim())) {
        throw new Error('Columna de orden inválida')
      }

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
      console.log('[DB] Error en buscarTodos')
      console.error('DB error:', error.code, error.sqlMessage)
      throw error
    }
  }

  buscarTodosClientes = async () => {

    const strSql = `SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto, activo, creado, modificado FROM usuarios WHERE tipo_usuario = 3`

    const conexion = await DBConnection.initConnection()
    
    try {

      const [rows] = await conexion.query(strSql)

      return rows.length > 0 ? rows : null
    } catch (error) {
      console.log('[DB] Error en buscarTodosClientes')
      throw error
    }

  }

  buscarPorId = async (usuarioId) => {
    const strSql = `SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto, activo, creado, modificado FROM usuarios WHERE usuario_id = ?`

    const conexion = await DBConnection.initConnection()

    try {
      const [rows] = await conexion.query(strSql, [usuarioId])

      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      console.log('[DB] Error en buscarPorId')
      throw error
    }
  }

  buscarPorNombreUsuario = async (nombreUsuario) => {
    const strSql =
      'SELECT usuario_id, nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, activo, creado, modificado FROM usuarios WHERE nombre_usuario = ?'

    try {
      const conexion = await DBConnection.initConnection()

      const [rows] = await conexion.query(strSql, [nombreUsuario])

      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      console.error(`[DB] Error en findByUserName(${nombreUsuario}):`, error)

      throw new Error(error.message)
    }
  }

  crear = async ({
    nombre,
    apellido,
    nombreUsuario,
    contrasenia,
    tipoUsuario,
    celular,
    foto,
    activo = 1
  }) => {
    const strSql =
      'INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'

    const conexion = await DBConnection.initConnection()

    try {
      await conexion.query(strSql, [
        nombre,
        apellido,
        nombreUsuario,
        contrasenia,
        tipoUsuario,
        celular,
        foto,
        activo
      ])
      const [rows] = await conexion.query(
        'SELECT LAST_INSERT_ID() AS usuarioId'
      )
      return this.buscarPorId(rows[0].usuarioId)
    } catch (error) {
      throw error
    }
  }

  actualizar = async (usuarioId, campos) => {
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

      const strSql = `UPDATE usuarios SET ${setClause} WHERE usuario_id = ?`

      await conexion.query(strSql, [...valores, usuarioId])

      return this.buscarPorId(usuarioId)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  eliminar = async (usuarioId) => {
    const strSql = 'UPDATE usuarios SET activo = 0 WHERE usuario_id = ?'

    const conexion = await DBConnection.initConnection()

    try {
      await conexion.query(strSql, [usuarioId])
    } catch (error) {
      throw error
    }
  }
}
