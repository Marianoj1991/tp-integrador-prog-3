import UsuariosServicios from '../services/usuarios.servicios.js'

export default class UsuariosControlador {
  constructor() {
    this.usuarios = new UsuariosServicios()
  }

  buscarTodos = async (req, res) => {
    const nombre = req.query.nombre
    const apellido = req.query.apellido
    const tipoUsuario = req.query.tipoUsuario

    const limit = req.query.limit
    const offset = req.query.offset
    const order = req.query.order
    const asc = req.query.asc

    try {
      const pLimit = limit ? Number(limit) : 0
      const pOffset = offset ? Number(offset) : 0
      const pOrder = order || 'usuarioId'
      const pAsc = asc === 'false' ? false : true
      const pTipoUsuario = tipoUsuario ? Number(tipoUsuario) : 3

      const filters = {}

      if (nombre) filters.nombre = nombre
      if (apellido) filters.apellido = apellido
      if (tipoUsuario) filters.tipoUsuario = pTipoUsuario

      const dataUsuarios = await this.usuarios.buscarTodos(
        filters,
        pLimit,
        pOffset,
        pOrder,
        pAsc
      )

      res.json({ status: 'OK', data: dataUsuarios })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILD', data: { error: error?.message || error } })
    }
  }

  buscarPorId = async (req, res) => {
    const usuarioId = Number(req.params.usuarioId)


    if (!Number.isInteger(usuarioId)) {
      res.status(400).json({ error: 'El parámetro debe ser un número entero' })
    }

    try {
      const usuario = await this.usuarios.buscarPorId(usuarioId)

      res.json({ status: 'OK', data: usuario })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  crear = async (req, res) => {
    const { body } = req

    if (
      !body.nombre ||
      !body.apellido ||
      !body.nombreUsuario ||
      !body.contrasenia
    ) {
      res.status(400).json({
        status: 'FAILED',
        data: {
          error:
            "Uno de los siguientes datos falta o es vacío: 'nombre', 'apellido' 'nombre de usuario', 'contrasenia'."
        }
      })
    }
    const usuario = {
      nombre: body.nombre,
      apellido: body.apellido,
      nombreUsuario: body.nombreUsuario,
      contrasenia: body.contrasenia,
      tipoUsuario: body.tipoUsuario ? body.tipoUsuario : 3,
      celular: body.celular ? body.celular : '',
      foto: body.foto ? body.foto : '',
      activo: 1
    }


    try {
      const usuarioCreado = await this.usuarios.crear(usuario)
      res.status(201).json({ status: 'OK', data: usuarioCreado })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  actualizar = async (req, res) => {
    const body = req.body
    const usuarioId = req.params.usuarioId

    if (!usuarioId) {
      res.status(404).json({
        status: 'FAILED',
        data: {
          error: 'El parámetro usuarioId no puede ser vacío.'
        }
      })
    }

    try {
      const usuarioActualizado = await this.usuarios.actualizar(usuarioId, body)
      res.status(200).json(usuarioActualizado)
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  eliminar = async (req, res) => {
    const usuarioId = req.params.usuarioId

    if (!usuarioId) {
      res.status(404).json({
        status: 'FAILED',
        data: { error: 'El parámetro usuarioId no puede ser vacío.' }
      })
    }

    try {
      await this.usuarios.eliminar(usuarioId)
      res.status(200).json({
        status: 'OK',
        data: {
            message: 'Usuario eliminado correctamente'
        }
      })
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }
}
