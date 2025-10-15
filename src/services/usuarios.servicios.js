import UsuariosDB from '../database/usuarios.db.js'
import UsuariosDTO from '../database/usuariosDTO.js'
import hashPassword from '../utils/hashPassword.js'

export default class UsuariosServicios {
  constructor() {
    this.usuarios = new UsuariosDB()
  }

  buscarTodos = async (filters, limit, offset, order, asc) => {
    let sqlFilter = null
    if (Object.keys(filters).length > 0) {
      sqlFilter = UsuariosDTO.toDBFields(filters)
    }

    const sqlOrder = UsuariosDTO.getFieldName(order)

    const strAsc = asc ? 'ASC ' : 'DESC '

    try {
      const usuariosDbResultados = await this.usuarios.buscarTodos(
        sqlFilter,
        limit,
        offset,
        sqlOrder,
        strAsc
      )

      const dtoResultados = usuariosDbResultados.map(
        (row) =>
          new UsuariosDTO(
            row['usuario_id'],
            row['nombre'],
            row['apellido'],
            row['tipo_usuario'],
            row['modificado'],
            row['activo']
          )
      )

      return dtoResultados
    } catch (err) {
      throw err
    }
  }

  buscarPorNombreUsuario = async (nombreUsuario) => {
    try {
      const usuario = await this.usuarios.buscarPorNombreUsuario(nombreUsuario)

      return usuario
    } catch (error) {
      throw error
    }
  }

  buscarPorId = async (id) => {
    try {
      const row = await this.usuarios.buscarPorId(id)

      return new UsuariosDTO(
        row['usuario_id'],
        row['nombre'],
        row['apellido'],
        row['tipo_usuario'],
        row['modificado'],
        row['activo']
      )
    } catch (err) {
      throw err
    }
  }

  crear = async (usuario) => {
    const { contrasenia, ...restoUsuario } = usuario

    if (!usuario?.contrasenia || typeof usuario.contrasenia !== 'string') {
      throw new Error('Contraseña inválida')
    }

    // ENCRIPTACION DE CONTRASENIA
    const hashedPassword = await hashPassword(contrasenia)
    try {
      const usuarioToInsert = {
        ...restoUsuario,
        contrasenia: hashedPassword,
        modificado: new Date().toISOString().replace('T', ' ').replace('Z', '')
      }

      const existeUsuario = await this.usuarios.buscarPorNombreUsuario(
        usuario.nombreUsuario
      )

      if (existeUsuario) {
        console.error('[UsuariosServicios][crear] Error:')
        throw new Error(`El usuario ${usuario.nombreUsuario} ya existe`)
      }

      const result = await this.usuarios.crear(usuarioToInsert)

      return new UsuariosDTO(
        result['usuario_id'],
        result['nombre'],
        result['apellido'],
        result['tipo_usuario'],
        result['modificado'],
        result['activo']
      )
    } catch (error) {
      throw error
    }
  }

  actualizar = async (usuarioId, datos) => {
    try {
      const existeUsuario = await this.usuarios.buscarPorId(usuarioId)

      if (!existeUsuario) {
        console.error('[UsuariosServicios][actualizar] Error:')
        throw new Error(`El usuario no existe`)
      }

      if (Number(existeUsuario.activo) === 0) {
        throw new Error(`El usuario se encuentra inactivo`)
      }

      const datosNuevos = {
        ...datos,
        modificado: new Date().toISOString().replace('T', ' ').replace('Z', '')
      }

      const datosDB = UsuariosDTO.toDBFields(datosNuevos).reduce((acc, act) => {
        return {
          ...acc,
          ...act
        }
      }, {})

      return this.usuarios.actualizar(usuarioId, datosDB)
    } catch (err) {
      throw err
    }
  }

  eliminar = async (usuarioId) => {
    try {
      const existeUsuario = await this.usuarios.buscarPorId(usuarioId)

      if (!existeUsuario) {
        throw new Error(`El usuario no existe`)
      }
      this.usuarios.eliminar(usuarioId)
    } catch (err) {
      console.error(err.message)
      throw err
    }
  }
}
