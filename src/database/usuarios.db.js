import errorsToRecord from '@hookform/resolvers/io-ts/dist/errorsToRecord.js'
import { allowedColumns } from '../constants'
import DBConnection from './dbConnection.db'

export default class Usuarios {
  findAll = async (
    filters = null,
    limit = 0,
    offset = 0,
    order = 'usuario_id',
    asc = 'ASC'
  ) => {
    let strSql = `SELECT usuario_id, nombre, apellido, tipo_usuario, modificado FROM usuarios WHERE activo = 1 AND `

    const filterValuesArray = []

    try {
      if (!allowedColumns.includes(order)) {
        throw new Error('Columna de orden inválida')
      }

      if (!allowedDirections.includes(asc.toUpperCase())) {
        throw new Error('Dirección de orden inválida')
      }

      if (filters) {
        for (const filter of filters) {
          for (const clave of Object.keys(filter)) {
            strSql += `${clave} = ? AND `
            filterValuesArray.push(filter[clave])
          }
        }

        strSql = strSql.substring(0, strSql.length - 4)
      }

      if (order) {
        strSql += ` ORDER BY ${order} ${asc}`
      }

      if (limit) {
        strSql += 'LIMIT ? OFFSET ? '
      }

      const conexion = await DBConnection.initConnection()

      const [rows] = await conexion.query(strSql, [
        ...filterValuesArray,
        limit,
        offset
      ])

      conexion.end()

      return rows
    } catch (error) {
      throw new Error(error.message)
    }
  }

  findById = async (usuarioId) => {
    const strSql = `SELECT usuario_id, nombre, apellido, tipo_usuario, modificado FROM usuarios WHERE usuario_id = ?`

    const conexion = await DBConnection.initConnection()

    try {
      const [rows] = await conexion.query(strSql, [usuarioId])

      conexion.end()

      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      throw error
    }
  }

  findByUserName = async (nombreUsuario) => {
    const strSql = 'SELECT usuario_id FROM usuarios WHERE nombre_usuario = ?'

    try {
      const conexion = await DBConnection.initConnection()

      const [rows] = await conexion.query(strSql, [nombreUsuario])

      conexion.end()

      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      console.error(`[DB] Error en findByUserName(${nombreUsuario}):`, error)

      throw new Error('No se pudo obtener el usuario por nombre de usuario')
    }
  }

  create = async ({
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
      conexion.end()
      return this.findById(rows[0].usuarioId)
    } catch (error) {
      throw error
    }
  }

  update = async (usuarioId, campos) => {
    const conexion = await BdUtils.initConnection()

    try {
      const entradas = Object.entries(campos).filter(
        ([_, valor]) => valor !== undefined
      )

      if (entradas.length === 0) {
        throw new Error('No hay campos para actualizar')
      }

      const setClause = entradas.map(([campo]) => `${campo} = ?`).join(', ')
      const valores = entradas.map(([_, valor]) => valor)

      const strSql = `UPDATE usuarios SET ${setClause} WHERE actor_id = ?`

      await conexion.query(strSql, [...valores, usuarioId])

      conexion.end()
      return this.findById(usuarioId)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  delete = async (usuarioId) => {
    const strSql = 'DELETE FROM usuarios WHERE usuario_id = ?'

    const conexion = await BdUtils.initConnection()

    try {
      await conexion.query(strSql, [usuarioId])

      conexion.end()
    } catch (error) {
      throw error
    }
  }
}
