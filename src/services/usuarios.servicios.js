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
            row['nombre_usuario'],
            row['tipo_usuario'],
            row['modificado'],
            row['activo'],
            row['celular'],
            row['foto']
          )
      )

      return dtoResultados
    } catch (err) {
      throw err
    }
  }

  buscarTodosClientes = async () => {
    try {
      const rows = await this.usuarios.buscarTodosClientes()

      return (rows ?? []).map(
        (row) =>
          new UsuariosDTO(
            row['usuario_id'],
            row['nombre'],
            row['apellido'],
            row['nombre_usuario'],
            row['tipo_usuario'],
            row['modificado'],
            row['activo'],
            row['celular'],
            row['foto']
          )
      )
    } catch (error) {
      console.log('ERROR en buscarTodosClientes ')
      throw error
    }
  }

  buscarPorNombreUsuario = async (nombreUsuario) => {
    try {
      return await this.usuarios.buscarPorNombreUsuario(nombreUsuario)
    } catch (error) {
      throw error
    }
  }

  buscarPorId = async (id) => {
    try {
      const usuario = await this.usuarios.buscarPorId(id)

      return usuario ? new UsuariosDTO(
        usuario['usuario_id'],
        usuario['nombre'],
        usuario['apellido'],
        usuario['nombre_usuario'],
        usuario['tipo_usuario'],
        usuario['modificado'],
        usuario['activo'],
        usuario['celular'],
        usuario['foto']
      ) : null
    } catch (err) {
      throw err
    }
  }

  crear = async (usuario) => {
    const { contrasenia, ...restoUsuario } = usuario

    if (!usuario?.contrasenia || typeof usuario.contrasenia !== 'string') {
      throw new Error('Contraseña inválida')
    }

    const hashedPassword = await hashPassword(contrasenia)
    try {
      const usuarioNuevo = {
        ...restoUsuario,
        contrasenia: hashedPassword
      }

      const existeUsuario = await this.usuarios.buscarPorNombreUsuario(
        usuario.nombreUsuario
      )

      if (existeUsuario) {
        console.error('[UsuariosServicios][crear] Error:')
        throw new Error(`El usuario ${usuario.nombreUsuario} ya existe`)
      }

      const nuevoUsuario = await this.usuarios.crear(usuarioNuevo)

      return new UsuariosDTO(
        nuevoUsuario['usuario_id'],
        nuevoUsuario['nombre'],
        nuevoUsuario['apellido'],
        nuevoUsuario['nombre_usuario'],
        nuevoUsuario['tipo_usuario'],
        nuevoUsuario['modificado'],
        nuevoUsuario['activo'],
        nuevoUsuario['celular'],
        nuevoUsuario['foto']
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

      const datosDB = UsuariosDTO.toDBFields(datos).reduce((acc, act) => {
        return {
          ...acc,
          ...act
        }
      }, {})

      const usuarioActualizado = await this.usuarios.actualizar(usuarioId, datosDB)

        return new UsuariosDTO(
          usuarioActualizado['usuario_id'],
          usuarioActualizado['nombre'],
          usuarioActualizado['apellido'],
          usuarioActualizado['nombre_usuario'],
          usuarioActualizado['tipo_usuario'],
          usuarioActualizado['modificado'],
          usuarioActualizado['activo'],
          usuarioActualizado['celular'],
          usuarioActualizado['foto']
        )
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
