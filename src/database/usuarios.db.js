import DBConnection from './dbConnection.db'

export default class Usuarios {
  findAll = async (
    filters = null,
    limit = 0,
    offset = 0,
    order = 'usuario_id',
    asc = 'ASC'
  ) => {
    let strSql = `SELECT usuario_id, nombre, apellido, modificado FROM usuarios `

    const filterValuesArray = []

    if (filters) {
      strSql += 'WHERE '

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
  }

  findById = async (usuarioId) => {
    const strSql = `SELECT usuario_id, nombre, apellido, modificado FROM usuarios WHERE usuario_id = ?`

    const conexion = await BdUtils.initConnection()

    const [rows] = await conexion.query(strSql, [usuarioId])

    conexion.end()

    return rows.length > 0 ? rows[0] : null
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

    const strSqlVerificar =
      'SELECT usuario_id FROM usuarios WHERE nombre_usuario = ?'

    const conexion = await DBConnection.initConnection()

    try {
      const [rowsVerificar] = await conexion.query(strSqlVerificar, [
        nombreUsuario
      ])

      if (rowsVerificar.length > 0) {
        throw new Error('El nombre de usuario ya existe')
      }
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
      return this.findById(rows[0].usuarioId)
    } catch (error) {
    } finally {
      conexion.end()
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

      return this.findById(usuarioId) }
    catch (error){
      throw new Error(error.message)
    } finally {
      conexion.end()
    }
  }

  destroy = async (usuarioId) => {
    const strSql = 'DELETE FROM usuarios WHERE usuario_id = ?'

    const conexion = await BdUtils.initConnection()

    await conexion.query(strSql, [usuarioId])

    conexion.end()
  }
}
