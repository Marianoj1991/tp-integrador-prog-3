import Usuarios from '../database/usuarios.db.js'
import UsuariosDTO from '../database/usuariosDTO.js'
import hashPassword from '../utils/hashPassword.js'

export default class UsuariosServices {
  constructor() {
    this.usuarios = new Usuarios()
  }

  findAll = async (filter, limit, offset, order, asc) => {
    let sqlFilter = null
    if (Object.keys(filter).length > 0) {
      sqlFilter = UsuariosDTO.toDBFields(filter)
    }
    const sqlOrder = UsuariosDTO.getFieldName(order)

    const strAsc = asc ? 'ASC ' : 'DESC '
    try {
      const tableResults = await this.usuarios.findAll(
        sqlFilter,
        limit,
        offset,
        sqlOrder,
        strAsc
      )


      const dtoResults = tableResults.map(
        (row) =>
          new UsuariosDTO(
            row['usuario_id'],
            row['nombre'],
            row['apellido'],
            row['tipo_usuario'],
            row['modificado']
          )
      )

      return dtoResults
    } catch (err) {
      throw err
    }
  }

  findById = async (id) => {
    try {
      const row = await this.usuarios.findById(id)
      return new UsuariosDTO(
        row['usuario_id'],
        row['nombre'],
        row['apellido'],
        row['tipo_usuario'],
        row['modificado']
      )
    } catch (err) {
      throw err
    }
  }

  create = async (usuario) => {
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

      const existingUser = await this.usuarios.findByUserName(
        usuario.nombreUsuario
      )

      if (existingUser) {
        console.error('[UsuariosServices][create] Error:')
        throw new Error(`El usuario ${usuario.nombreUsuario} ya existe`)
      }

      return await this.usuarios.create(usuarioToInsert)
    } catch (error) {
      throw error
    }
  }

  update = async (usuarioId, usuario) => {
    try {
      const existingUser = await this.usuarios.findById(id)

      if (!existingUser) {
        console.error('[UsuariosServices][update] Error:', err)
        throw new Error(`El usuario no existe`)
      }

      const usuarioToUpdate = {
        ...usuario,
        modificado: new Date().toISOString().replace('T', ' ').replace('Z', '')
      }
      return this.usuarios.update(usuarioId, usuarioToUpdate)
    } catch (err) {
      throw err
    }
  }

  destroy = async (usuarioId) => {
    try {
      const existingUser = await this.usuarios.findById(id)

      if (!existingUser) {
        console.error('[UsuariosServices][update] Error:', err)
        throw new Error(`El usuario no existe`)
      }
      this.usuarios.delete(usuarioId)
    } catch (err) {
      throw err
    }
  }
}
