import Servicios from '../services/servicios.services.js'

export default class ServiciosControlador {
  constructor() {
    this.servicios = new Servicios()
  }

  buscarTodos = async (req, res) => {
    const descripcion = req.query.descripcion
    const importe = req.query.importe

    const limit = req.query.limit
    const offset = req.query.offset
    const order = req.query.order
    const asc = req.query.asc

    try {
      const pLimit = limit ? Number(limit) : 0
      const pOffset = offset ? Number(offset) : 0
      const pOrder = order || 'servicioId'
      const pAsc = asc === 'false' ? false : true

      const filters = {}

      if (descripcion) filters.descripcion = descripcion
      if (importe) filters.importe = importe

      const dataServicios = await this.servicios.buscarTodos(
        filters,
        pLimit,
        pOffset,
        pOrder,
        pAsc
      )

      res.json({ status: 'OK', data: dataServicios })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  buscarPorId = async (req, res) => {
    const servicioId = Number(req.params.servicioId)


    if (!Number.isInteger(servicioId)) {
      res.status(400).json({ error: 'El parámetro debe ser un número entero' })
    }

    try {
      const servicio = await this.servicios.buscarPorId(servicioId)

      res.json({ status: 'OK', data: servicio })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  crear = async (req, res) => {
    const { body } = req
    const bDescripcion = body.descripcion 
    ? body.descripcion.trim() : ''
    const bImporte = body.importe ? body.importe : 0 
    const bActivo = body.activo ? body.activo : 0
    
    if (
      !body.descripcion ||
      !body.importe 
    ) {
      res.status(400).json({
        status: 'FAILED',
        data: {
          error:
          "Uno de los siguientes datos falta o es vacío: 'descripcion', 'importe '."
        }
      })
    }

    const servicio = {
      bDescripcion,
      bImporte,
      bActivo
    }

    try {
      const servicioCreado = await this.servicios.crear(servicio)
      res.status(201).json({ status: 'OK', data: servicioCreado })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  actualizar = async (req, res) => {
    const body = req.body
    const servicioId = req.params.servicioId

    if (!servicioId) {
      res.status(404).json({
        status: 'FAILED',
        data: {
          error: 'El parámetro servicioId no puede ser vacío.'
        }
      })
    }

    try {
      const servicioActualizado = await this.servicios.actualizar(servicioId, body)
      res.status(200).json({ status: 'OK', data: servicioActualizado})
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  eliminar = async (req, res) => {
    const servicioId = req.params.servicioId

    if (!servicioId) {
      res.status(404).json({
        status: 'FAILED',
        data: { error: 'El parámetro servicioId no puede ser vacío.' }
      })
    }

    try {
      await this.servicios.eliminar(servicioId)
      res.status(200).json({
        status: 'OK',
        data: {
            message: 'Servicio eliminado correctamente'
        }
      })
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }
}
