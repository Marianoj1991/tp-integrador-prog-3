import { formatosValidos } from '../constants/index.js'
import ReservasServicio from '../services/reservas.servicios.js'

export default class ReservasControlador {
  constructor() {
    this.reservasServicio = new ReservasServicio()
  }

  buscarTodos = async (req, res) => {
    try {
      const reservas = await this.reservasServicio.buscarTodos()

      res.json({ status: 'OK', data: reservas })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  buscarPorId = async (req, res) => {
    const reservaId = Number(req.params.reservaId)

    if (!Number.isInteger(reservaId)) {
      return res
        .status(400)
        .json({ error: 'El parámetro debe ser un número entero' })
    }

    try {
      const reserva = await this.reservasServicio.buscarPorId(reservaId)

      res.json({ status: 'OK', data: reserva })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  crear = async (req, res) => {
    try {
      const {
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios
      } = req.body

      const reserva = {
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_total,
        importe_salon,
        servicios
      }

      const nuevaReserva = await this.reservasServicio.crear(reserva)

      if (!nuevaReserva) {
        return res.status(400).json({
          estado: 'FAILED',
          mensaje: 'Reserva no creada'
        })
      }

      res.status(201).json({ status: 'OK', data: nuevaReserva })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }

  informe = async (req, res) => {
    try {
      const formato = req.query.formato

      
      if (!formato || !formatosValidos.includes(formato)) {
        return res
        .status(400)
        .json({ status: 'FAILED', data: { error: 'Formato no válido' } })
      }
      
      await this.reservasServicio.generarInforme(formato)
      
      const { buffer, path, headers } =
        await this.reservasServicio.generarInforme(formato)

      res.set(headers)

      if (formato === 'pdf') {
        res.status(200).end(buffer)
      } else if (formato === 'csv') {
        res.status(200).download(path, (err) => {
          if (err) {
            return res.status(500).send({
              estado: 'Falla',
              mensaje: ' No se pudo generar el informe.'
            })
          }
        })
      }
    } catch (error) {
      return res
        .status(400)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }
    actualizar = async (req, res) => {
    const body = req.body
    const reservaId = req.params.reservaId
      console.log
    if (!reservaId) {
      res.status(404).json({
        status: 'FAILED',
        data: {
          error: 'El parámetro reservaId no puede ser vacío.'
        }
      })
    }

    try {
      const reservaActualizada = await this.reservasServicio.actualizar(reservaId, body)
      res.status(200).json(reservaActualizada)
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }
}
