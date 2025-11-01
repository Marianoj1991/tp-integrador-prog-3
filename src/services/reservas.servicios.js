import Reservas from "../database/reservas.db.js";
import ReservasServicios from "../database/reservas_servicios.js";
import SalonesDB from "../database/salones.db.js";
// import NotificacionesService from "./notificacionesServicio.js";

export default class ReservasServicio {
  constructor() {
    this.reserva = new Reservas();
    this.reservas_servicios = new ReservasServicios();
    this.salonesDB = new SalonesDB();
    // this.notificacioes_servicios = new NotificacionesService();
  }

  buscarTodos = async () => {
    try {
      return await this.reserva.buscarTodos();
    } catch (err) {
      throw err;
    }
  };

  buscarPorId = async (reserva_id) => {
    try {
      return await this.reserva.buscarPorId(reserva_id);
    } catch (err) {
      throw err;
    }
  };

  crear = async (reserva) => {
    const {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_total,
      servicios,
    } = reserva;
    const {importe} = await this.salonesDB.buscarImporteSalon(salon_id);

    const nuevaReserva = {
    fecha_reserva,
    salon_id,
    usuario_id,
    turno_id,
    foto_cumpleaniero,
    tematica,
    importe_salon: importe,
    importe_total:Number(importe_total) + Number(importe),
    };
    
    const result = await this.reserva.crear(nuevaReserva);
    console.log(result)

    // if (!result) {
    //   // return null;
    // }

    // CREO LAS RELACIONES RESERVAS-SERVICIOS
    // await this.reservas_servicios.crear(result.reserva_id, servicios);

    // BUSCO LOS DATOS PARA LA NOTIFICACION, LEYENDO DESDE LA BASE DE DATOS (DATOS CREADOS)
    // const datosParaNotificacion = await this.reserva.datosParaNotificacion(result.reserva_id);

    // ENVIO NOTIFICACION
    // await this.notificacioes_servicios.enviarCorreo(datosParaNotificacion);

    // RETORNO LA RESERVA CREADA
    // return this.reserva.buscarPorId(result.reserva_id);
  };
}
