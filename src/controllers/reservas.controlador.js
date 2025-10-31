import ReservasServicio from "../services/reservas.servicios.js";

export default class ReservasControlador {
  constructor() {
    this.reservasServicio = new ReservasServicio();
  }

  buscarTodos = async (req, res) => {
    try {
      const reservas = await this.reservasServicio.buscarTodos();

      res.json({ status: "OK", data: reservas });
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  };

  buscarPorId = async (req, res) => {
    const reservaId = Number(req.params.reservaId);

    if (!Number.isInteger(reservaId)) {
      return res
        .status(400)
        .json({ error: "El parámetro debe ser un número entero" });
    }

    try {
      const reserva = await this.reservasServicio.buscarPorId(reservaId);

      res.json({ status: "OK", data: reserva });
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  };

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
        servicios,
      } = req.body;

      const reserva = {
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios,
      };

      const nuevaReserva = await this.reservasServicio.crear(reserva);

      if (!nuevaReserva) {
        return res.status(404).json({
          estado: false,
          mensaje: "Reserva no creada",
        });
      }

      res.status(201).json({ status: "OK", data: nuevaReserva });
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
}
