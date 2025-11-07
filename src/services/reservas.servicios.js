import Reservas from '../database/reservas.db.js'
import ReservasServicios from '../database/reservas_servicios.db.js'
import SalonesDB from '../database/salones.db.js'
import InformeServicio from './informes.servicios.js'
import NotificacionesServicio from './notificaciones.servicios.js'

export default class ReservasServicio {
  constructor() {
    this.reservaDb = new Reservas()
    this.reservasServicios = new ReservasServicios()
    this.salonesDB = new SalonesDB()
    this.notificaciones_servicios = new NotificacionesServicio()
    this.informeServicios = new InformeServicio()
  }

  buscarTodos = async () => {
    try {
      return await this.reservaDb.buscarTodos()
    } catch (err) {
      throw err
    }
  }

  buscarPorId = async (reserva_id) => {
    try {
      const reserva = await this.reservaDb.buscarPorId(reserva_id)

      if (!reserva) {
        throw new Error(`No existe reserva con ID ${reserva_id}`)
      }

      return reserva
    } catch (error) {
      throw error
    }
  }

  crear = async (reserva) => {
    const {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      importe_total,
      importe_salon,
      tematica,
      servicios
    } = reserva

    const nuevaReserva = {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon: Number(importe_salon),
      importe_total: Number(importe_total)
    }

    try {
      const result = await this.reservaDb.crear(nuevaReserva)

      if (!result) {
        return null
      }

      await this.reservasServicios.crear(result.reserva_id, servicios)

      const datosParaNotificacion = await this.reservaDb.datosParaNotificacion(
        result.reserva_id,
        result.usuario_id
      )

      const adminMails = await this.reservaDb.obtenerMailAdmins()

      await this.notificaciones_servicios.enviarCorreo(
        datosParaNotificacion[0][0],
        adminMails[0]
      )

      return this.reservaDb.buscarPorId(result.reserva_id)
    } catch (error) {
      console.log('[SERVICIOS reservas] ERROR en reservas servicios: ', error)
      throw error
    }
  }

  generarInforme = async (formato) => {
    try {
      const { datosInforme, totalPorSalon, ingresosPorMes } =
        await this.reservaDb.buscarDatosParaInformes()

      let datos = {
        datosInforme,
        totalPorSalon,
        ingresosPorMes
      }

      if (formato === 'pdf') {
        const fechaGeneracion = new Date().toLocaleString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })

        datos = {
          ...datos,
          fechaGeneracion
        }

        const buffer = await this.informeServicios.informeReservasPdf(datos)

        return {
          buffer,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Dispositon': 'inline;'
          }
        }
      } else if (formato === 'csv') {
        
        const csv = await this.informeServicios.informeReservasCsv(datos)
        return {
          path: csv,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Dispositon': 'attachment; filename = "reporte.csv"'
          }
        }
      }
    } catch (error) {
      console.error('[ReservaServicios][generarInforma] Error:', error)
      throw error
    }
  }
  actualizar = async (reservaId, datos) => {
    try {
      const existeReserva = await this.reservaDb.buscarPorId(reservaId)

      if (!existeReserva) {
        throw new Error(`No existe reserva con ID ${reserva_id}`)
      }

      return this.reservaDb.actualizar(reservaId, datos)
    } catch (error) {
      console.error('[Reserva][actualizar] Error:', error)
      throw error
    }
  }
}
