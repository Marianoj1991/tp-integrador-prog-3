import SalonesServicios from '../services/salones.servicios.js'

export default class SalonesControlador {
  constructor() {
    this.salones = new SalonesServicios()
  }

  buscarTodos = async (req, res) => {
    const titulo = req.query.titulo
    const direccion = req.query.direccion
    const importe = req.query.importe
    const capacidad = req.query.capacidad

    const limit = req.query.limit
    const offset = req.query.offset
    const order = req.query.order
    const asc = req.query.asc

    try {
      const pCapacidad = capacidad ? Number(capacidad) : 0
      const pImporte = importe ? Number(importe) : importe
      const pLimit = limit ? Number(limit) : 0
      const pOffset = offset ? Number(offset) : 0
      const pOrder = order || 'salon_id'
      const pAsc = asc === 'false' ? false : true

      const filters = {}

      if (titulo) filters.titulo = titulo
      if (direccion) filters.direccion = direccion
      if (pImporte) filters.importe = pImporte
      if (pCapacidad) filters.capacidad = pCapacidad

      const dataSalon = await this.salones.buscarTodos(
        filters,
        pLimit,
        pOffset,
        pOrder,
        pAsc
      )

      res.json({ status: 'OK', data: dataSalon })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  buscarPorId = async (req, res) => {
    const salonId = Number(req.params.salonId)

    if (!Number.isInteger(salonId)) {
      return res
        .status(400)
        .json({ error: 'El parámetro debe ser un número entero' })
    }

    try {
      const salon = await this.salones.buscarPorId(salonId)

      res.json({ status: 'OK', data: salon })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  crear = async (req, res) => {
    const { body } = req
    const bDireccion = body.direccion ? body.direccion.trim() : ''
    const bImporte = body.importe ? body.importe : 0
    const bActivo = body.activo === 0 ? body.activo : 1
    const bTitulo = body.titulo ? body.titulo.trim() : ''
    const bCapacidad = body.capacidad ? body.capacidad : 0
    const bLatitud = body.latitud ? body.latitud : 0
    const bLongitud = body.longitud ? body.longitud : 0

    if (!body.direccion || !body.importe || !body.titulo) {
      return res.status(400).json({
        status: 'FAILED',
        data: {
          error:
            "Uno de los siguientes datos falta o es vacío: 'direccion', 'importe' o 'titulo'."
        }
      })
    }

    const salon = {
      bDireccion,
      bImporte,
      bActivo,
      bTitulo,
      bCapacidad,
      bLatitud,
      bLongitud
    }

    try {
      const servicioCreado = await this.salones.crear(salon)
      res.status(201).json({ status: 'OK', data: servicioCreado })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  actualizar = async (req, res) => {
    const salonId = req.params.salonId
    const { direccion, importe, activo, titulo, capacidad, latitud, longitud } =
      req.body

    const salon = {
      direccion: direccion?.trim(),
      importe,
      activo,
      titulo: titulo?.trim(),
      capacidad,
      latitud,
      longitud
    }

    console.log(salon);

    if (!salonId) {
      return res.status(404).json({
        status: 'FAILED',
        data: {
          error: 'El parámetro salonId no puede ser vacío.'
        }
      })
    }

    try {
      const servicioActualizado = await this.salones.actualizar(salonId, salon)
      res.status(200).json(servicioActualizado)
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  eliminar = async (req, res) => {
    const salonId = req.params.salonId

    if (!salonId) {
      return res.status(404).json({
        status: 'FAILED',
        data: { error: 'El parámetro salonId no puede ser vacío.' }
      })
    }

    try {
      await this.salones.eliminar(salonId)
      res.status(200).json({
        status: 'OK',
        data: {
          message: 'Salón eliminado correctamente'
        }
      })
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }
}
